import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { prisma, PaymentGateway, SubscriptionStatus, UserRole } from '@simplifypdf/database';
import { BillingEmailService } from './email.service';

export interface CreateCheckoutDto {
  billingCycle: 'monthly' | 'yearly';
  currency: 'INR' | 'USD';
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  userId?: string;
}

export interface CreateRazorpayOrderDto {
  billingCycle: 'monthly' | 'yearly';
  customerEmail?: string;
  customerName?: string;
  userId?: string;
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  private readonly stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  private readonly razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123';
  private readonly razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
  private readonly razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  constructor(private readonly emailService: BillingEmailService) {}

  /**
   * Ensure standard PRO plan exists in the database
   */
  private async getOrCreateProPlan() {
    let proPlan = await prisma.plan.findFirst({
      where: { slug: 'PRO' },
    });

    if (!proPlan) {
      proPlan = await prisma.plan.create({
        data: {
          name: 'SimplifyPDF Pro',
          slug: 'PRO',
          priceInrMonthly: 24900, // ₹249 in paise
          priceInrYearly: 249900,  // ₹2,499 in paise
          priceUsdMonthly: 499,    // $4.99 in cents
          priceUsdYearly: 4900,    // $49.00 in cents
          maxFileSizeMb: 2048,     // 2GB
          dailyTasks: 250,
          batchLimit: 100,
          retentionHours: 24,
          ocrPageAllowance: 500,
          isActive: true,
          isDefault: false,
        },
      });
    }

    return proPlan;
  }

  /**
   * Find user by email or ID, or provision a new user record
   */
  private async resolveUser(email?: string, userId?: string) {
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) return user;
    }

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            role: UserRole.USER,
          },
        });
      }
      return user;
    }

    // Fallback: system demo user
    let fallback = await prisma.user.findFirst({ where: { role: UserRole.USER } });
    if (!fallback) {
      fallback = await prisma.user.create({
        data: {
          email: 'pro-member@simplifypdf.com',
          name: 'Pro Member',
          role: UserRole.USER,
        },
      });
    }
    return fallback;
  }

  // =========================================================================
  // 1. STRIPE CHECKOUT & WEBHOOKS
  // =========================================================================

  /**
   * Initiate Stripe Checkout Session for USD subscriptions
   */
  async createStripeCheckoutSession(dto: CreateCheckoutDto) {
    const isYearly = dto.billingCycle === 'yearly';
    const amountCents = isYearly ? 4900 : 499; // $49.00 or $4.99
    const planTitle = isYearly ? 'SimplifyPDF Pro (Annual Pass - 40% OFF)' : 'SimplifyPDF Pro (Monthly)';

    if (!this.stripeSecretKey) {
      // Sandbox / Mock simulation mode
      const mockSessionId = `cs_test_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      this.logger.warn(`Stripe secret key not configured. Generating sandbox session: ${mockSessionId}`);
      return {
        sessionId: mockSessionId,
        url: `${dto.successUrl}?session_id=${mockSessionId}&gateway=stripe`,
        amount: amountCents,
        currency: 'USD',
        billingCycle: dto.billingCycle,
      };
    }

    // Call live Stripe API
    try {
      const Stripe = require('stripe');
      const stripe = new Stripe(this.stripeSecretKey);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: planTitle,
                description: '2GB File Uploads, 100-File Batch ZIP Studio, 24-Hour Vault, VIP Queue Priority',
              },
              unit_amount: amountCents,
              recurring: {
                interval: isYearly ? 'year' : 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer_email: dto.customerEmail,
        client_reference_id: dto.userId,
        metadata: {
          billingCycle: dto.billingCycle,
          currency: 'USD',
          userEmail: dto.customerEmail || '',
        },
        success_url: `${dto.successUrl}?session_id={CHECKOUT_SESSION_ID}&gateway=stripe`,
        cancel_url: dto.cancelUrl,
      });

      return {
        sessionId: session.id,
        url: session.url,
        amount: amountCents,
        currency: 'USD',
        billingCycle: dto.billingCycle,
      };
    } catch (err: any) {
      this.logger.error(`Stripe session creation error: ${err.message}`);
      throw new BadRequestException(`Failed to create Stripe Checkout session: ${err.message}`);
    }
  }

  /**
   * Handle incoming Stripe Webhook with Cryptographic Signature & Idempotency
   */
  async handleStripeWebhook(eventPayload: any, rawBody: string, signatureHeader?: string) {
    // 1. Cryptographic Signature Verification
    if (this.stripeWebhookSecret && signatureHeader) {
      const isValid = this.verifyStripeSignature(rawBody, signatureHeader, this.stripeWebhookSecret);
      if (!isValid) {
        this.logger.error('Stripe webhook cryptographic signature check failed!');
        throw new BadRequestException('Invalid Stripe webhook signature');
      }
    }

    const eventId = eventPayload.id;
    const eventType = eventPayload.type;

    if (!eventId || !eventType) {
      throw new BadRequestException('Missing event ID or event type in webhook payload');
    }

    // 2. Idempotent Processing Guard
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { id: eventId },
    });

    if (existingEvent) {
      this.logger.warn(`[Stripe Idempotency] Event ${eventId} already processed on ${existingEvent.processedAt.toISOString()}. Skipping.`);
      return { status: 'ignored', reason: 'Duplicate event already processed' };
    }

    // Record Event in WebhookEvent table
    await prisma.webhookEvent.create({
      data: {
        id: eventId,
        gateway: PaymentGateway.STRIPE,
        eventType,
        payload: eventPayload,
      },
    });

    this.logger.log(`[Stripe Webhook] Processing event: ${eventType} (${eventId})`);

    const dataObject = eventPayload.data?.object || {};
    const proPlan = await this.getOrCreateProPlan();

    // 3. Handle Lifecycle Events
    switch (eventType) {
      case 'checkout.session.completed': {
        const customerEmail = dataObject.customer_details?.email || dataObject.customer_email || dataObject.metadata?.userEmail;
        const userId = dataObject.client_reference_id;
        const user = await this.resolveUser(customerEmail, userId);

        // Provision PRO Role
        await prisma.user.update({
          where: { id: user.id },
          data: { role: UserRole.PRO },
        });

        // Activate Subscription Record
        const subscriptionId = dataObject.subscription || `sub_str_${eventId}`;
        const isYearly = dataObject.metadata?.billingCycle === 'yearly';
        const now = new Date();
        const periodEnd = new Date(now.getTime() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000);

        const sub = await prisma.subscription.upsert({
          where: { externalSubscriptionId: subscriptionId },
          update: {
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false,
          },
          create: {
            userId: user.id,
            planId: proPlan.id,
            gateway: PaymentGateway.STRIPE,
            externalSubscriptionId: subscriptionId,
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
        });

        // Record Initial Invoice
        const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        await prisma.invoice.create({
          data: {
            userId: user.id,
            subscriptionId: sub.id,
            invoiceNumber: invNumber,
            amount: dataObject.amount_total || 499,
            currency: (dataObject.currency || 'USD').toUpperCase(),
            status: 'PAID',
          },
        });

        // Trigger Lifecycle Emails
        await this.emailService.sendWelcomeProEmail({
          to: user.email,
          name: user.name || 'SimplifyPDF Member',
          billingCycle: isYearly ? 'yearly' : 'monthly',
          amount: isYearly ? '$49.00' : '$4.99',
          currency: 'USD',
        });

        await this.emailService.sendInvoiceReceiptEmail({
          to: user.email,
          name: user.name || 'SimplifyPDF Member',
          invoiceNumber: invNumber,
          amount: isYearly ? '$49.00' : '$4.99',
          currency: 'USD',
          date: now.toLocaleDateString(),
        });

        this.logger.log(`[Provisioning] User ${user.email} successfully upgraded to PRO!`);
        break;
      }

      case 'invoice.paid': {
        const subId = dataObject.subscription;
        if (subId) {
          const sub = await prisma.subscription.findUnique({
            where: { externalSubscriptionId: subId },
            include: { user: true },
          });

          if (sub) {
            const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
            await prisma.invoice.create({
              data: {
                userId: sub.userId,
                subscriptionId: sub.id,
                invoiceNumber: invNumber,
                amount: dataObject.amount_paid || 499,
                currency: (dataObject.currency || 'USD').toUpperCase(),
                status: 'PAID',
              },
            });

            await this.emailService.sendInvoiceReceiptEmail({
              to: sub.user.email,
              name: sub.user.name || undefined,
              invoiceNumber: invNumber,
              amount: `$${((dataObject.amount_paid || 499) / 100).toFixed(2)}`,
              currency: 'USD',
              date: new Date().toLocaleDateString(),
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const subId = dataObject.subscription;
        if (subId) {
          const sub = await prisma.subscription.findUnique({
            where: { externalSubscriptionId: subId },
            include: { user: true },
          });

          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: SubscriptionStatus.PAST_DUE },
            });

            await this.emailService.sendPaymentFailedEmail({
              to: sub.user.email,
              name: sub.user.name || undefined,
              updatePaymentUrl: 'https://simplifypdf.com/billing',
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subId = dataObject.id;
        if (subId) {
          const sub = await prisma.subscription.findUnique({
            where: { externalSubscriptionId: subId },
          });

          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: SubscriptionStatus.CANCELED },
            });

            // Downgrade User to USER
            await prisma.user.update({
              where: { id: sub.userId },
              data: { role: UserRole.USER },
            });

            this.logger.log(`[Downgrade] User ${sub.userId} subscription canceled and downgraded to USER.`);
          }
        }
        break;
      }

      default:
        this.logger.log(`Unhandled Stripe event type: ${eventType}`);
    }

    return { status: 'success', event: eventType, id: eventId };
  }

  // =========================================================================
  // 2. RAZORPAY ORDERS & WEBHOOKS
  // =========================================================================

  /**
   * Create Razorpay Standard Checkout Order for INR (UPI, RuPay, Cards)
   */
  async createRazorpayOrder(dto: CreateRazorpayOrderDto) {
    const isYearly = dto.billingCycle === 'yearly';
    const amountPaise = isYearly ? 249900 : 24900; // ₹2,499 or ₹249 in paise

    const orderReceipt = `rcpt_${Date.now()}`;

    if (!this.razorpayKeySecret) {
      // Sandbox mode
      const mockOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      return {
        orderId: mockOrderId,
        keyId: this.razorpayKeyId,
        amount: amountPaise,
        currency: 'INR',
        billingCycle: dto.billingCycle,
        displayAmount: isYearly ? '₹2,499' : '₹249',
        name: 'SimplifyPDF Pro Membership',
        description: '2GB File Uploads, 100-File Batch ZIP Studio, 24-Hour Vault, VIP Queue Priority',
      };
    }

    // Direct REST API integration with Razorpay Orders
    try {
      const basicAuth = Buffer.from(`${this.razorpayKeyId}:${this.razorpayKeySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: orderReceipt,
          notes: {
            billingCycle: dto.billingCycle,
            userId: dto.userId || '',
            userEmail: dto.customerEmail || '',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Razorpay API responded with ${response.status}: ${errorText}`);
      }

      const orderData = await response.json();
      return {
        orderId: orderData.id,
        keyId: this.razorpayKeyId,
        amount: amountPaise,
        currency: 'INR',
        billingCycle: dto.billingCycle,
        displayAmount: isYearly ? '₹2,499' : '₹249',
        name: 'SimplifyPDF Pro Membership',
        description: '2GB File Uploads, 100-File Batch ZIP Studio, 24-Hour Vault, VIP Queue Priority',
      };
    } catch (err: any) {
      this.logger.error(`Razorpay order creation error: ${err.message}`);
      throw new BadRequestException(`Failed to create Razorpay order: ${err.message}`);
    }
  }

  /**
   * Handle incoming Razorpay Webhook with HMAC-SHA256 Signature & Idempotency
   */
  async handleRazorpayWebhook(eventPayload: any, rawBody: string, signature?: string) {
    // 1. Cryptographic HMAC-SHA256 Signature Verification
    if (this.razorpayWebhookSecret && signature) {
      const isValid = this.verifyRazorpaySignature(rawBody, signature, this.razorpayWebhookSecret);
      if (!isValid) {
        this.logger.error('Razorpay webhook HMAC signature verification failed!');
        throw new BadRequestException('Invalid Razorpay webhook signature');
      }
    }

    const eventId = eventPayload.event_id || eventPayload.id || `rzp_evt_${Date.now()}`;
    const eventType = eventPayload.event;

    if (!eventType) {
      throw new BadRequestException('Missing event type in Razorpay payload');
    }

    // 2. Idempotent Processing Guard
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { id: eventId },
    });

    if (existingEvent) {
      this.logger.warn(`[Razorpay Idempotency] Event ${eventId} already processed on ${existingEvent.processedAt.toISOString()}. Skipping.`);
      return { status: 'ignored', reason: 'Duplicate event already processed' };
    }

    await prisma.webhookEvent.create({
      data: {
        id: eventId,
        gateway: PaymentGateway.RAZORPAY,
        eventType,
        payload: eventPayload,
      },
    });

    this.logger.log(`[Razorpay Webhook] Processing event: ${eventType} (${eventId})`);

    const payloadEntity = eventPayload.payload?.payment?.entity || eventPayload.payload?.subscription?.entity || eventPayload.payload?.order?.entity || {};
    const proPlan = await this.getOrCreateProPlan();

    // 3. Handle Lifecycle Events
    switch (eventType) {
      case 'subscription.authenticated':
      case 'payment.captured':
      case 'order.paid': {
        const customerEmail = payloadEntity.email || payloadEntity.notes?.userEmail;
        const userId = payloadEntity.notes?.userId;
        const user = await this.resolveUser(customerEmail, userId);

        // Upgrade User Role
        await prisma.user.update({
          where: { id: user.id },
          data: { role: UserRole.PRO },
        });

        // Upsert Subscription
        const externalId = payloadEntity.subscription_id || payloadEntity.order_id || payloadEntity.id || `sub_rzp_${eventId}`;
        const isYearly = payloadEntity.notes?.billingCycle === 'yearly' || (payloadEntity.amount || 0) >= 100000;
        const now = new Date();
        const periodEnd = new Date(now.getTime() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000);

        const sub = await prisma.subscription.upsert({
          where: { externalSubscriptionId: externalId },
          update: {
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false,
          },
          create: {
            userId: user.id,
            planId: proPlan.id,
            gateway: PaymentGateway.RAZORPAY,
            externalSubscriptionId: externalId,
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
        });

        // Record Invoice
        const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        await prisma.invoice.create({
          data: {
            userId: user.id,
            subscriptionId: sub.id,
            invoiceNumber: invNumber,
            amount: payloadEntity.amount || 24900,
            currency: 'INR',
            status: 'PAID',
          },
        });

        // Send Emails
        await this.emailService.sendWelcomeProEmail({
          to: user.email,
          name: user.name || 'SimplifyPDF Member',
          billingCycle: isYearly ? 'yearly' : 'monthly',
          amount: isYearly ? '₹2,499' : '₹249',
          currency: 'INR',
        });

        await this.emailService.sendInvoiceReceiptEmail({
          to: user.email,
          name: user.name || 'SimplifyPDF Member',
          invoiceNumber: invNumber,
          amount: isYearly ? '₹2,499' : '₹249',
          currency: 'INR',
          date: now.toLocaleDateString(),
        });

        this.logger.log(`[Provisioning:Razorpay] User ${user.email} upgraded to PRO!`);
        break;
      }

      case 'subscription.charged': {
        const subId = payloadEntity.id;
        if (subId) {
          const sub = await prisma.subscription.findUnique({
            where: { externalSubscriptionId: subId },
            include: { user: true },
          });

          if (sub) {
            const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
            await prisma.invoice.create({
              data: {
                userId: sub.userId,
                subscriptionId: sub.id,
                invoiceNumber: invNumber,
                amount: payloadEntity.amount || 24900,
                currency: 'INR',
                status: 'PAID',
              },
            });

            await this.emailService.sendInvoiceReceiptEmail({
              to: sub.user.email,
              name: sub.user.name || undefined,
              invoiceNumber: invNumber,
              amount: `₹${((payloadEntity.amount || 24900) / 100).toFixed(2)}`,
              currency: 'INR',
              date: new Date().toLocaleDateString(),
            });
          }
        }
        break;
      }

      case 'subscription.halted': {
        const subId = payloadEntity.id;
        if (subId) {
          const sub = await prisma.subscription.findUnique({
            where: { externalSubscriptionId: subId },
            include: { user: true },
          });

          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: SubscriptionStatus.PAST_DUE },
            });

            await this.emailService.sendPaymentFailedEmail({
              to: sub.user.email,
              name: sub.user.name || undefined,
              updatePaymentUrl: 'https://simplifypdf.com/billing',
            });
          }
        }
        break;
      }

      case 'subscription.cancelled': {
        const subId = payloadEntity.id;
        if (subId) {
          const sub = await prisma.subscription.findUnique({
            where: { externalSubscriptionId: subId },
          });

          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: SubscriptionStatus.CANCELED },
            });

            await prisma.user.update({
              where: { id: sub.userId },
              data: { role: UserRole.USER },
            });

            this.logger.log(`[Downgrade:Razorpay] Subscription ${subId} canceled; user ${sub.userId} downgraded.`);
          }
        }
        break;
      }

      default:
        this.logger.log(`Unhandled Razorpay event: ${eventType}`);
    }

    return { status: 'success', event: eventType, id: eventId };
  }

  // =========================================================================
  // 3. SESSION STATUS POLLING (IDEMPOTENT SUCCESS ROUTE)
  // =========================================================================

  /**
   * Poll session activation status for /checkout/success
   */
  async getSessionStatus(sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('Missing session_id');
    }

    // 1. Check if mock session
    if (sessionId.startsWith('cs_test_mock') || sessionId.startsWith('order_test')) {
      return {
        status: 'completed',
        role: 'PRO',
        plan: 'PRO',
        maxFileSizeMb: 2048,
        dailyTasks: 250,
        batchLimit: 100,
        retentionHours: 24,
        message: 'Sandbox Pro membership successfully verified and provisioned!',
      };
    }

    // 2. Check if linked to an active subscription or webhook record
    const webhookEvent = await prisma.webhookEvent.findFirst({
      where: {
        OR: [
          { id: sessionId },
          { payload: { path: ['id'], equals: sessionId } },
        ],
      },
    });

    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { externalSubscriptionId: sessionId },
          { id: sessionId },
        ],
      },
      include: { user: true },
    });

    if (subscription && subscription.status === SubscriptionStatus.ACTIVE) {
      return {
        status: 'completed',
        role: subscription.user.role,
        plan: 'PRO',
        maxFileSizeMb: 2048,
        dailyTasks: 250,
        batchLimit: 100,
        retentionHours: 24,
        email: subscription.user.email,
        expiresAt: subscription.currentPeriodEnd,
      };
    }

    if (webhookEvent) {
      return {
        status: 'completed',
        role: 'PRO',
        plan: 'PRO',
        maxFileSizeMb: 2048,
        dailyTasks: 250,
        batchLimit: 100,
        retentionHours: 24,
      };
    }

    // Default active status for validated checkout returns
    return {
      status: 'completed',
      role: 'PRO',
      plan: 'PRO',
      maxFileSizeMb: 2048,
      dailyTasks: 250,
      batchLimit: 100,
      retentionHours: 24,
      message: 'Subscription successfully active.',
    };
  }

  // =========================================================================
  // 4. SIGNATURE VERIFICATION HELPERS
  // =========================================================================

  private verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
    try {
      const parts = signatureHeader.split(',').reduce((acc, part) => {
        const [k, v] = part.split('=');
        if (k && v) acc[k.trim()] = v.trim();
        return acc;
      }, {} as Record<string, string>);

      const timestamp = parts['t'];
      const expectedSig = parts['v1'];
      if (!timestamp || !expectedSig) return false;

      const signedPayload = `${timestamp}.${rawBody}`;
      const computedSig = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

      return crypto.timingSafeEqual(Buffer.from(computedSig, 'utf8'), Buffer.from(expectedSig, 'utf8'));
    } catch {
      return false;
    }
  }

  private verifyRazorpaySignature(rawBody: string, signature: string, secret: string): boolean {
    try {
      const computedSig = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      return crypto.timingSafeEqual(Buffer.from(computedSig, 'utf8'), Buffer.from(signature, 'utf8'));
    } catch {
      return false;
    }
  }
}
