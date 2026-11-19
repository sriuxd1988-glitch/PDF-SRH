'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, HelpCircle } from 'lucide-react';
import { ButtonV6, NextSaaSBtn, Badge } from '@simplifypdf/ui';
import Link from 'next/link';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const proPrice = currency === 'INR'
    ? (isYearly ? '₹399' : '₹499')
    : (isYearly ? '$5.50' : '$7.00');

  const billedPeriod = isYearly ? 'per month, billed annually' : 'per month';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center gap-16">
      {/* Header */}
      <div className="text-center max-w-2xl flex flex-col items-center gap-4">
        <Badge variant="pro">TRANSPARENT PLANS</Badge>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-[var(--ink)] tracking-tight">
          Simple pricing for individuals and teams
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted)]">
          Start for free with 50MB files. Upgrade to PRO whenever you need 2GB limits, batch ZIP queues, and 24-hour file retention.
        </p>

        {/* Toggles */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[var(--soft)] border border-[var(--line)]">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                !isYearly ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isYearly ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
              }`}
            >
              <span>Yearly</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[var(--lime)] text-[var(--secondary)] text-[10px] font-black">
                SAVE 20%
              </span>
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--soft)] border border-[var(--line)] text-xs font-bold">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded-full transition-all ${
                currency === 'INR' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-full transition-all ${
                currency === 'USD' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
              }`}
            >
              USD ($)
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
              <h3 className="font-heading font-black text-2xl text-[var(--ink)]">Free Starter</h3>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--soft)] text-[var(--muted)]">
                GUEST & REGISTERED
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-6">
              <span className="font-heading font-black text-5xl text-[var(--ink)]">₹0</span>
              <span className="text-sm font-semibold text-[var(--muted)]">/ forever</span>
            </div>
            <p className="text-sm text-[var(--muted)] mb-8">
              Perfect for quick everyday tasks without needing any subscription.
            </p>

            <ul className="flex flex-col gap-3.5 text-sm text-[var(--ink)]">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>50 MB</strong> max file size</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>10 tasks</strong> per day</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Single file processing</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>2-hour</strong> automatic shredding</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>5 OCR pages per month</span>
              </li>
            </ul>
          </div>

          <div className="mt-10">
            <Link href="/tools/compress" className="w-full block">
              <button className="w-full py-3.5 px-6 rounded-2xl bg-[var(--soft)] hover:bg-[var(--line)] font-bold text-sm text-[var(--ink)] transition-colors">
                Use Free Now
              </button>
            </Link>
          </div>
        </div>

        {/* PRO PLAN */}
        <div className="relative rounded-3xl border-2 border-[var(--primary-500)] bg-[var(--card)] p-8 sm:p-10 flex flex-col justify-between shadow-xl">
          <div className="absolute -top-3.5 right-8">
            <Badge variant="pro" className="shadow-md">RECOMMENDED</Badge>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-black text-2xl text-[var(--ink)]">SimplifyPDF PRO</h3>
              <Sparkles className="w-5 h-5 text-[var(--primary-500)]" />
            </div>
            <div className="flex items-baseline gap-1 my-6">
              <span className="font-heading font-black text-5xl text-[var(--ink)]">{proPrice}</span>
              <span className="text-sm font-semibold text-[var(--muted)]">/ {billedPeriod}</span>
            </div>
            <p className="text-sm text-[var(--muted)] mb-8">
              Uncapped multi-file batch workflows for professionals, researchers, and enterprises.
            </p>

            <ul className="flex flex-col gap-3.5 text-sm text-[var(--ink)]">
              <li className="flex items-center gap-3 font-semibold">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong>2 GB (2048 MB)</strong> per document</span>
              </li>
              <li className="flex items-center gap-3 font-semibold">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong>250 tasks</strong> daily allowance</span>
              </li>
              <li className="flex items-center gap-3 font-semibold">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong>Batch ZIP processing</strong> (up to 100 files at once)</span>
              </li>
              <li className="flex items-center gap-3 font-semibold">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong>Priority worker queue</strong> (skip waitlines)</span>
              </li>
              <li className="flex items-center gap-3 font-semibold">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span><strong>24-hour</strong> file retention with manual wipe</span>
              </li>
              <li className="flex items-center gap-3 font-semibold">
                <Check className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
                <span>500 OCR pages per month</span>
              </li>
            </ul>
          </div>

          <div className="mt-10">
            <Link href="/login?plan=pro" className="w-full block">
              <ButtonV6
                text="Upgrade to PRO"
                hoverText="Unlock 2GB Processing"
                variant="primary"
                size="lg"
                className="w-full justify-center"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
