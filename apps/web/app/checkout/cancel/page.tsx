'use client';

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ArrowLeft,
  RefreshCcw,
  ShieldAlert,
  CreditCard,
  Smartphone,
  Mail,
  CheckCircle,
} from 'lucide-react';
import { ButtonV6, NextSaaSBtn } from '@simplifypdf/ui';

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center text-center">
      {/* Icon Banner */}
      <div className="w-16 h-16 rounded-3xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-center text-[var(--muted)] mb-6 shadow-sm">
        <ShieldAlert className="w-8 h-8 text-amber-500" />
      </div>

      <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">
        Checkout was not completed
      </h1>
      <p className="text-base text-[var(--muted)] font-normal mt-2.5 max-w-lg leading-relaxed">
        No worries! No funds were deducted from your card or UPI account. You can retry anytime or continue using SimplifyPDF with our Free Starter plan.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Link href="/pricing">
          <ButtonV6
            text="Return to Pricing"
            hoverText="Choose Monthly or Annual"
            variant="primary"
            size="md"
          />
        </Link>

        <Link
          href="/tools/compress"
          className="py-3 px-6 rounded-2xl bg-[var(--soft)] hover:bg-[var(--line)] text-[var(--ink)] font-medium text-sm transition-colors"
        >
          Continue with Free Tools
        </Link>
      </div>

      {/* Helpful Troubleshooting Card */}
      <div className="w-full mt-12 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm text-left">
        <h2 className="font-heading font-semibold text-xl text-[var(--ink)] mb-4 flex items-center gap-2 tracking-tight">
          <HelpCircle className="w-5 h-5 text-[var(--primary-500)]" />
          Common Checkout Questions &amp; Troubleshooting
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="pb-4 border-b border-[var(--line)]">
            <h3 className="font-bold text-[var(--ink)] mb-1 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[var(--primary-500)]" />
              UPI / QR Code timed out?
            </h3>
            <p className="text-[var(--muted)] leading-relaxed">
              UPI authorization requests in apps like Google Pay, PhonePe, or Paytm typically expire after 5 minutes. If your bank request timed out, simply click 'Return to Pricing' and regenerate a fresh QR code.
            </p>
          </div>

          <div className="pb-4 border-b border-[var(--line)]">
            <h3 className="font-bold text-[var(--ink)] mb-1 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[var(--primary-500)]" />
              International Card Declines (3D Secure)
            </h3>
            <p className="text-[var(--muted)] leading-relaxed">
              Ensure international transactions and recurring subscriptions are toggled ON in your bank's mobile app. Our Stripe gateway requires 3D Secure / OTP authentication.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--ink)] mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[var(--primary-500)]" />
              Need custom invoicing, GST input credit, or wire transfer?
            </h3>
            <p className="text-[var(--muted)] leading-relaxed">
              For corporate purchase orders, multi-seat licenses, or annual invoicing with GST credit, contact our billing team at{' '}
              <a
                href="mailto:billing@simplifypdf.com"
                className="text-[var(--primary-500)] font-bold hover:underline"
              >
                billing@simplifypdf.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
