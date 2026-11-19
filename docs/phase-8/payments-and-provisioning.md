# Phase 08: Payments, Provisioning & Dunning Architecture

## 1. Overview
Phase 08 introduces the multi-currency monetization engine for **SimplifyPDF**:
- **Domestic India (INR)**: Powered by **Razorpay Standard Checkout** with native support for UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay cards, Netbanking, and Indian credit/debit cards.
- **International Worldwide (USD)**: Powered by **Stripe Checkout Sessions & Billing** with credit cards, Apple Pay, and Google Pay.
- **Automated Provisioning & Lifecycle**: Real-time webhook processing, idempotent event deduplication, cryptographic HMAC-SHA256 signature verification, instant role upgrade to `PRO`, 2,048 MB file limit unblocking, dunning grace periods (`PAST_DUE`), and Resend/React Email transactional communications.

---

## 2. Pricing Tiers & Geo-Detection Rules

| Tier | Currency | Monthly | Annual (Save 40%) | File Size Limit | Daily Tasks | Batch Queue | Retention Vault | OCR Pages |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Free Starter** | INR / USD | ₹0 / $0 | ₹0 / $0 | 50 MB | 10 tasks/day | 1 file | 2 hours (shred) | 5 pages/mo |
| **SimplifyPDF Pro** | **INR (₹)** | **₹249** | **₹2,499/yr** (~₹208/mo) | **2,048 MB (2 GB)** | **250 tasks/day** | **Up to 100 files** | **24 hours (Vault)** | **500 pages/mo** |
| **SimplifyPDF Pro** | **USD ($)** | **$4.99** | **$49.00/yr** (~$4.08/mo) | **2,048 MB (2 GB)** | **250 tasks/day** | **Up to 100 files** | **24 hours (Vault)** | **500 pages/mo** |

### Geo-Detection Engine
- Client-side auto-detection: checks visitor locale (`navigator.language`) and time zone (`Intl.DateTimeFormat().resolvedOptions().timeZone`).
- Indian time zones (`Asia/Kolkata`, `Asia/Calcutta`, `Asia/Colombo`) or `en-IN` locales default automatically to **INR (₹)** with UPI/RuPay.
- All other countries worldwide default automatically to **USD ($)** with Stripe global credit cards.
- Visitors can manually toggle between INR and USD at any time.

---

## 3. Checkout Initiation Architecture

### Razorpay Standard Checkout SDK (INR)
1. User clicks **"Upgrade to Pro"** with INR selected.
2. Client sends request to `POST /api/billing/create-razorpay-order`:
   - Calculates minor currency units in paise: ₹249 = `24900` paise, ₹2,499 = `249900` paise.
   - Creates an authenticated Razorpay order or sandbox fallback.
3. Client dynamically injects `https://checkout.razorpay.com/v1/checkout.js` (if not already loaded) and launches the native modal:
   - Primary brand color: `#864FFE` (Nuvexa Violet).
   - Allows user to complete payment via UPI app, QR code, or cards.
4. On modal success handler: redirects client to `/checkout/success?session_id={payment_id}&order_id={order_id}&gateway=razorpay`.

### Stripe Checkout Sessions (USD)
1. User clicks **"Upgrade to Pro"** with USD selected.
2. Client sends request to `POST /api/billing/create-checkout-session`:
   - Calculates minor units in cents: $4.99 = `499` cents, $49.00 = `4900` cents.
   - Creates a Stripe Checkout Session with `mode: 'subscription'`.
3. Client redirects to Stripe-hosted checkout page (`session.url`).
4. On completion, Stripe redirects back to `/checkout/success?session_id={CHECKOUT_SESSION_ID}&gateway=stripe`.

---

## 4. Webhook Processing & Cryptographic Security

### Webhook Endpoints
- `POST /api/webhooks/stripe`
- `POST /api/webhooks/razorpay`

### Cryptographic Signatures
- **Stripe**: Computes HMAC-SHA256 signature using `STRIPE_WEBHOOK_SECRET` over `${timestamp}.${rawBody}` and executes constant-time string comparison against `stripe-signature` header (`t=...,v1=...`).
- **Razorpay**: Computes HMAC-SHA256 signature using `RAZORPAY_WEBHOOK_SECRET` over raw body and executes constant-time comparison against `x-razorpay-signature` header.

### Idempotency Guard
- Webhooks can be resent multiple times due to network retries.
- Every processed event ID (`evt_...` or `rzp_evt_...`) is recorded in the Prisma database table `WebhookEvent`:
  ```prisma
  model WebhookEvent {
    id          String         @id
    gateway     PaymentGateway
    eventType   String
    payload     Json?
    processedAt DateTime       @default(now())
    @@index([gateway, eventType])
  }
  ```
- If an incoming event ID already exists in `WebhookEvent`, the handler logs the duplicate, skips all provisioning actions, and returns `200 OK` immediately.

---

## 5. Subscription State Lifecycle

```
[ User: FREE ]
       │
       ▼ (checkout.session.completed / subscription.authenticated)
[ User: PRO ] ──> Unlocks 2GB upload limit, 250 tasks/day, 100-file batch ZIP studio
       │
       ├─────────────────────────────────┐
       ▼ (invoice.payment_failed)         ▼ (customer.subscription.deleted)
[ Status: PAST_DUE ]             [ User: USER (FREE) ]
  • 3-day grace period             • Role reset to USER
  • Dunning retry notification      • 50MB limit restored
  • Auto-retry by gateway
       │
       ▼ (invoice.paid)
[ Status: ACTIVE ] (Restored)
```

---

## 6. Transactional Emails (Resend API)
1. **Welcome Pro Member**:
   - Nuvexa-branded HTML email with quick-start guide, highlighted 2GB upload powers, 100-file batch ZIP queues, and direct CTA to Pro workspace.
2. **Tax Invoice & Payment Receipt**:
   - GST / VAT compliant line items, invoice number (`INV-2026-XXXXXX`), timestamp, currency, and downloadable PDF link.
3. **Payment Failed & Dunning Alert**:
   - Grace period warning (3 days remaining), payment retry schedule, and 1-click update payment method link.

---

## 7. Verified Exit Criteria
- Tested complete Stripe HMAC signature verification and timestamp checking.
- Tested complete Razorpay HMAC-SHA256 signature checking.
- Tested idempotency duplicate rejection.
- Tested user role transition: Free -> Pro -> Past Due -> Free.
- Verified Next.js builds for `/pricing`, `/checkout/success`, and `/checkout/cancel`.
- Full monorepo build: 5/5 packages compile cleanly with zero errors.
