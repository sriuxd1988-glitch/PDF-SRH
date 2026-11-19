'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  CreditCard,
  Smartphone,
  ArrowRight,
  Layers,
  FileCheck2,
  Clock,
  Lock,
  Headphones,
} from 'lucide-react';
import { ButtonV6, NextSaaSBtn, Badge } from '@simplifypdf/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(true);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // 1. Auto-detect visitor country (India -> INR, Worldwide -> USD)
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const lang = typeof navigator !== 'undefined' ? navigator.language : '';
      if (
        tz.includes('Calcutta') ||
        tz.includes('Kolkata') ||
        tz.includes('Asia/Colombo') ||
        lang.includes('-IN')
      ) {
        setCurrency('INR');
      } else {
        setCurrency('USD');
      }
    } catch {
      setCurrency('INR');
    }
  }, []);

  // Pricing calculations
  const inrMonthly = 249;
  const inrYearlyTotal = 2499; // ₹208/mo
  const inrMonthlyEquiv = Math.round(inrYearlyTotal / 12);

  const usdMonthly = 4.99;
  const usdYearlyTotal = 49.0; // $4.08/mo
  const usdMonthlyEquiv = (usdYearlyTotal / 12).toFixed(2);

  const displayPrice =
    currency === 'INR'
      ? isYearly
        ? `₹${inrMonthlyEquiv}`
        : `₹${inrMonthly}`
      : isYearly
      ? `$${usdMonthlyEquiv}`
      : `$${usdMonthly}`;

  const periodSubtitle = isYearly
    ? currency === 'INR'
      ? `billed annually at ₹${inrYearlyTotal.toLocaleString()}/yr`
      : `billed annually at $${usdYearlyTotal}/yr`
    : 'billed monthly, cancel anytime';

  // Checkout Initiation Handlers
  const handleProCheckout = async () => {
    setIsLoadingCheckout(true);

    try {
      if (currency === 'INR') {
        // --- RAZORPAY CHECKOUT FLOW ---
        const res = await fetch('/api/billing/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            billingCycle: isYearly ? 'yearly' : 'monthly',
            customerEmail: userEmail || undefined,
          }),
        });

        const orderData = await res.json();

        // Check if Razorpay script is loaded
        if (typeof window !== 'undefined') {
          if (!(window as any).Razorpay) {
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.onload = () => resolve();
              script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
              document.body.appendChild(script);
            });
          }

          const options = {
            key: orderData.keyId || 'rzp_test_mockKey123',
            amount: orderData.amount,
            currency: 'INR',
            name: 'SimplifyPDF Pro Membership',
            description: orderData.description,
            order_id: orderData.orderId?.startsWith('order_test') ? undefined : orderData.orderId,
            prefill: {
              email: userEmail || 'member@simplifypdf.com',
            },
            theme: {
              color: '#864FFE',
            },
            modal: {
              ondismiss: () => {
                setIsLoadingCheckout(false);
              },
            },
            handler: function (response: any) {
              const paymentId = response.razorpay_payment_id || `pay_${Date.now()}`;
              router.push(
                `/checkout/success?session_id=${paymentId}&order_id=${orderData.orderId}&gateway=razorpay`
              );
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      } else {
        // --- STRIPE CHECKOUT FLOW ---
        const res = await fetch('/api/billing/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            billingCycle: isYearly ? 'yearly' : 'monthly',
            currency: 'USD',
            customerEmail: userEmail || undefined,
            successUrl: `${window.location.origin}/checkout/success`,
            cancelUrl: `${window.location.origin}/checkout/cancel`,
          }),
        });

        const sessionData = await res.json();
        if (sessionData.url) {
          window.location.href = sessionData.url;
        } else {
          router.push(`/checkout/success?session_id=${sessionData.sessionId}&gateway=stripe`);
        }
      }
    } catch (err: any) {
      alert(`Checkout error: ${err.message}. Routing to demo success.`);
      router.push(`/checkout/success?session_id=demo_${Date.now()}&gateway=${currency === 'INR' ? 'razorpay' : 'stripe'}`);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center gap-16">
      {/* Header */}
      <div className="text-center max-w-3xl flex flex-col items-center gap-4">
        <Badge variant="pro">TRANSPARENT VALUE &bull; NO SURPRISES</Badge>
        <h1 className="font-heading font-bold text-4xl sm:text-6xl text-[var(--ink)] tracking-tight">
          Supercharge your PDF workflow
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted)] font-normal max-w-2xl leading-relaxed">
          Start free with 50MB files. Upgrade to PRO whenever you need massive 2GB processing, 100-file batch ZIP queues, and a 24-hour file vault.
        </p>

        {/* Toggles Container */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--soft)] border border-[var(--line)] shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                !isYearly ? 'bg-[var(--card)] text-[var(--ink)] font-semibold shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                isYearly ? 'bg-[var(--card)] text-[var(--ink)] font-semibold shadow-sm' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--lime)] text-neutral-950 text-[10px] font-bold tracking-wide">
                SAVE 40%
              </span>
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-1 p-1.5 rounded-full bg-[var(--soft)] border border-[var(--line)] text-xs font-medium shadow-sm">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currency === 'INR' ? 'bg-[var(--card)] text-[var(--ink)] font-semibold shadow-sm' : 'text-[var(--muted)]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>INR (₹) UPI &amp; Cards</span>
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currency === 'USD' ? 'bg-[var(--card)] text-[var(--ink)] font-semibold shadow-sm' : 'text-[var(--muted)]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>USD ($) Stripe Global</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* FREE PLAN */}
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-2xl text-[var(--ink)]">Free Starter</h3>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--soft)] text-[var(--muted)]">
                NO CARD REQUIRED
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-6">
              <span className="font-heading font-bold text-5xl text-[var(--ink)] tracking-tight">
                {currency === 'INR' ? '₹0' : '$0'}
              </span>
              <span className="text-sm font-normal text-[var(--muted)]">/ forever</span>
            </div>
            <p className="text-sm text-[var(--muted)] font-normal mb-8 leading-relaxed">
              Ideal for students and casual users who need instant compression and single-file conversions.
            </p>

            <ul className="flex flex-col gap-3.5 text-sm text-[var(--ink)] font-normal">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="font-semibold">50 MB</strong> max file size per upload</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="font-semibold">10 tasks</strong> daily processing quota</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Single document processing</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="font-semibold">2-hour</strong> auto-shredding countdown</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>5 OCR pages per month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standard conversion queue</span>
              </li>
            </ul>
          </div>

          <div className="mt-10">
            <Link href="/tools/compress" className="w-full block">
              <button className="w-full py-4 px-6 rounded-2xl bg-[var(--soft)] hover:bg-[var(--line)] font-medium text-sm text-[var(--ink)] transition-colors text-center">
                Get Started Free &rarr;
              </button>
            </Link>
          </div>
        </div>

        {/* PRO PLAN */}
        <div className="relative rounded-3xl border-2 border-[var(--primary-500)] bg-[var(--card)] p-8 sm:p-10 flex flex-col justify-between shadow-xl">
          <div className="absolute -top-3.5 right-8">
            <Badge variant="pro" className="shadow-md">RECOMMENDED FOR POWER USERS</Badge>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-2xl text-[var(--ink)]">SimplifyPDF PRO</h3>
              <Sparkles className="w-5 h-5 text-[var(--primary-500)]" />
            </div>
            <div className="flex items-baseline gap-2 my-6">
              <span className="font-heading font-bold text-5xl text-[var(--ink)] tracking-tight">{displayPrice}</span>
              <span className="text-sm font-normal text-[var(--muted)]">/ month</span>
            </div>
            <p className="text-xs font-medium text-[var(--primary-700)] mb-6 -mt-4">
              {periodSubtitle}
            </p>
            <p className="text-sm text-[var(--muted)] font-normal mb-6 leading-relaxed">
              Massive 2GB files, 100-document multi-file batch ZIP studio, and dedicated worker dispatch.
            </p>

            <ul className="flex flex-col gap-3.5 text-sm text-[var(--ink)] font-normal">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong className="font-semibold">2,048 MB (2 GB)</strong> file size limit</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong className="font-semibold">250 tasks</strong> daily allowance</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong className="font-semibold">Multi-file Batch ZIP Studio</strong> (up to 100 files)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong className="font-semibold">24-Hour Vault</strong> with 1-click shredding</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong className="font-semibold">VIP Priority Worker Stream</strong> (no wait lines)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong className="font-semibold">500 OCR pages / mo</strong> with full searchability</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong className="font-semibold">Cryptographic E-Sign</strong> audit trail certificate</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleProCheckout}
              disabled={isLoadingCheckout}
              className="w-full py-4 px-6 rounded-2xl bg-[var(--primary-500)] hover:bg-[var(--primary-700)] text-white font-medium text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isLoadingCheckout ? (
                <span className="text-white">Initiating Gateway...</span>
              ) : (
                <>
                  <span className="text-white">
                    Upgrade to Pro &mdash; {currency === 'INR' ? (isYearly ? '₹2,499/yr' : '₹249/mo') : (isYearly ? '$49/yr' : '$4.99/mo')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] font-normal text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> 256-bit SSL
              </span>
              <span>&bull;</span>
              <span>Cancel Anytime</span>
              <span>&bull;</span>
              <span>GST/VAT Invoicing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Capability Comparison Matrix */}
      <div className="w-full max-w-4xl mt-8">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-3xl text-[var(--ink)] tracking-tight">
            Compare Feature Capabilities
          </h2>
          <p className="text-sm text-[var(--muted)] mt-1">
            See exactly what is included across the Free Starter and Pro tiers.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--soft)] text-xs uppercase tracking-wider">
                <th className="p-4 font-heading font-semibold text-[var(--ink)]">Feature</th>
                <th className="p-4 font-heading font-semibold text-[var(--muted)]">Free Starter</th>
                <th className="p-4 font-heading font-semibold text-[var(--primary-500)]">SimplifyPDF PRO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">Maximum File Size Limit</td>
                <td className="p-4 text-[var(--muted)]">50 MB</td>
                <td className="p-4 font-semibold text-[var(--ink)]">2,048 MB (2 GB)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">Daily Task Allowance</td>
                <td className="p-4 text-[var(--muted)]">10 Tasks / Day</td>
                <td className="p-4 font-semibold text-[var(--ink)]">250 Tasks / Day</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">Multi-File Batch Queue</td>
                <td className="p-4 text-[var(--muted)]">Single File Only</td>
                <td className="p-4 font-semibold text-[var(--ink)]">Up to 100 Files in Batch ZIP Studio</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">Secure Storage Retention</td>
                <td className="p-4 text-[var(--muted)]">2 Hours (Auto-shred)</td>
                <td className="p-4 font-semibold text-[var(--ink)]">24 Hours (Vault + 1-Click Shred)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">OCR Text Recognition</td>
                <td className="p-4 text-[var(--muted)]">5 Pages / Month</td>
                <td className="p-4 font-semibold text-[var(--ink)]">500 Pages / Month (Multi-Lingual)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">Worker Queue Priority</td>
                <td className="p-4 text-[var(--muted)]">Standard Queue</td>
                <td className="p-4 font-semibold text-emerald-600">VIP High-Speed Dedicated Stream</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">E-Signature Verification</td>
                <td className="p-4 text-[var(--muted)]">Basic Signature</td>
                <td className="p-4 font-semibold text-[var(--ink)]">Cryptographic SHA-256 Audit Trail</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">Customer Support</td>
                <td className="p-4 text-[var(--muted)]">Community FAQ</td>
                <td className="p-4 font-semibold text-[var(--ink)]">24/7 Dedicated Priority Support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <h3 className="font-heading font-bold text-2xl text-[var(--ink)] text-center tracking-tight">
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)]">
            <h4 className="font-semibold text-[var(--ink)] text-sm mb-1">
              Can I pay with UPI, Google Pay, or PhonePe?
            </h4>
            <p className="text-xs text-[var(--muted)] font-normal leading-relaxed">
              Yes! For Indian users, our Razorpay gateway accepts all UPI apps (Google Pay, PhonePe, Paytm, BHIM), RuPay cards, and netbanking in Indian Rupees (₹).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)]">
            <h4 className="font-semibold text-[var(--ink)] text-sm mb-1">
              What payment methods are supported for international users?
            </h4>
            <p className="text-xs text-[var(--muted)] font-normal leading-relaxed">
              International customers can pay via Stripe using Visa, Mastercard, American Express, Apple Pay, and Google Pay in USD ($).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)]">
            <h4 className="font-semibold text-[var(--ink)] text-sm mb-1">
              Can I cancel my subscription at any time?
            </h4>
            <p className="text-xs text-[var(--muted)] font-normal leading-relaxed">
              Absolutely. You can cancel with one click from your billing dashboard. You will retain Pro benefits until the end of your billing cycle with zero penalties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
