import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Req,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { BillingService, CreateCheckoutDto, CreateRazorpayOrderDto } from './billing.service';

@Controller('api')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(private readonly billingService: BillingService) {}

  /**
   * Stripe Webhook Handler
   */
  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
    @Req() req: FastifyRequest
  ) {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    return this.billingService.handleStripeWebhook(payload, rawBody, signature);
  }

  /**
   * Razorpay Webhook Handler
   */
  @Post('webhooks/razorpay')
  @HttpCode(HttpStatus.OK)
  async handleRazorpayWebhook(
    @Body() payload: any,
    @Headers('x-razorpay-signature') signature: string,
    @Req() req: FastifyRequest
  ) {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    return this.billingService.handleRazorpayWebhook(payload, rawBody, signature);
  }

  /**
   * Create Stripe Checkout Session (USD)
   */
  @Post('billing/create-checkout-session')
  async createStripeCheckout(@Body() dto: CreateCheckoutDto) {
    return this.billingService.createStripeCheckoutSession(dto);
  }

  /**
   * Create Razorpay Order (INR)
   */
  @Post('billing/create-razorpay-order')
  async createRazorpayOrder(@Body() dto: CreateRazorpayOrderDto) {
    return this.billingService.createRazorpayOrder(dto);
  }

  /**
   * Check Session / Subscription Status
   */
  @Get('billing/session-status')
  async getSessionStatus(@Query('session_id') sessionId: string) {
    return this.billingService.getSessionStatus(sessionId);
  }
}
