'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import { ButtonV6, Badge } from '@simplifypdf/ui';
import { useApp } from '../../components/DashboardShell';

export default function BillingPage() {
  const { userRole, setUserRole, openUpgradeModal } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const invoices = [
    { id: 'INV-2025-001', date: 'Nov 01, 2025', amount: '₹249.00', status: 'Paid', receiptUrl: '#' },
    { id: 'INV-2025-002', date: 'Oct 01, 2025', amount: '₹249.00', status: 'Paid', receiptUrl: '#' },
    { id: 'INV-2025-003', date: 'Sep 01, 2025', amount: '₹249.00', status: 'Paid', receiptUrl: '#' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight">
              Subscription &amp; Billing
            </h1>
            {userRole === 'PRO' ? (
              <Badge variant="pro">Active Pro Plan</Badge>
            ) : (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--soft)] text-[var(--muted)] border border-[var(--line)]">
                Free Starter
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--muted)] font-normal mt-1.5 max-w-2xl leading-relaxed">
            Manage your payment methods, change billing frequency, download GST/VAT invoices, or cancel anytime with one click.
          </p>
        </div>

        {userRole === 'PRO' ? (
          <button
            onClick={() => alert('Redirecting to Stripe / Razorpay Customer Portal...')}
            className="px-5 py-2.5 rounded-2xl bg-[var(--secondary)] text-white font-bold text-xs hover:bg-black transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <span>Manage via Stripe Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </button>
        ) : (
          <div onClick={() => openUpgradeModal('Direct billing page upgrade')}>
            <ButtonV6 text="Upgrade to Pro" hoverText="₹249/mo (Cancel anytime)" variant="primary" size="md" />
          </div>
        )}
      </div>

      {/* Active Plan Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                Current Active Subscription
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Secure SSL Gateway
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="font-heading font-semibold text-3xl text-[var(--ink)] tracking-tight">
                {userRole === 'PRO' ? 'SimplifyPDF Pro Member' : 'SimplifyPDF Free Starter'}
              </h2>
            </div>

            <p className="text-sm text-[var(--muted)] font-normal mt-2 leading-relaxed">
              {userRole === 'PRO'
                ? 'Your subscription is billed monthly at ₹249 INR ($4.99 USD). Next renewal on December 20, 2026.'
                : 'Free starter tier with 10 tasks/day and 50MB file size limit. Upgrade to unlock 2,048 MB limits.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              <div className="p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
                <span className="text-[10px] font-medium text-[var(--muted)] uppercase">Max File Limit</span>
                <span className="block text-sm font-semibold text-[var(--ink)] mt-0.5">{userRole === 'PRO' ? '2,048 MB' : '50 MB'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
                <span className="text-[10px] font-medium text-[var(--muted)] uppercase">Daily Tasks</span>
                <span className="block text-sm font-semibold text-[var(--ink)] mt-0.5">{userRole === 'PRO' ? '250 Tasks' : '10 Tasks'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
                <span className="text-[10px] font-medium text-[var(--muted)] uppercase">Retention Vault</span>
                <span className="block text-sm font-semibold text-[var(--ink)] mt-0.5">{userRole === 'PRO' ? '24 Hours' : '2 Hours'}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--line)] flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted)]">
              Payment Method: Visa ending in 4242
            </span>
            {userRole === 'PRO' ? (
              <button
                onClick={() => {
                  setUserRole('FREE');
                  alert('Subscription downgraded to Free Starter.');
                }}
                className="text-xs font-semibold text-rose-500 hover:underline"
              >
                Cancel Subscription
              </button>
            ) : (
              <button
                onClick={() => setUserRole('PRO')}
                className="text-xs font-semibold text-[var(--primary-500)] hover:underline"
              >
                Simulate Instant Pro Activation
              </button>
            )}
          </div>
        </div>

        {/* Quick Upgrade/Pricing Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--secondary)] text-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--lime)] text-neutral-950 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> PRO PASS
            </div>
            <h3 className="font-heading font-bold text-2xl text-white tracking-tight">Power Tools for Power Users</h3>
            <p className="text-xs text-neutral-400 font-normal mt-2 leading-relaxed">
              Batch convert up to 100 documents at once, e-sign with cryptographic audit trails, and priority queue dispatch.
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-heading font-bold text-3xl text-white tracking-tight">₹249</span>
              <span className="text-xs text-neutral-400 font-normal">/ month ($4.99 USD)</span>
            </div>
          </div>

          <div className="mt-8" onClick={() => openUpgradeModal('Billing sidebar upgrade CTA')}>
            <ButtonV6 text="Upgrade to Pro" hoverText="Instant Activation" variant="primary" size="md" />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading font-semibold text-xl text-[var(--ink)] tracking-tight">
              Invoices &amp; Receipts
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Download GST and VAT compliant PDF invoices for business bookkeeping.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider font-bold">
                <th className="pb-3.5 pl-2">Invoice Number</th>
                <th className="pb-3.5">Date</th>
                <th className="pb-3.5">Amount</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5 text-right pr-2">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] font-medium">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[var(--soft)]/50 transition-colors">
                  <td className="py-4 pl-2 font-bold font-mono text-[var(--ink)] flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[var(--primary-500)]" />
                    <span>{inv.id}</span>
                  </td>
                  <td className="py-4 text-[var(--muted)]">{inv.date}</td>
                  <td className="py-4 font-bold text-[var(--ink)]">{inv.amount}</td>
                  <td className="py-4">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-2">
                    <button
                      onClick={() => alert(`Downloading PDF receipt for ${inv.id}`)}
                      className="px-3 py-1.5 rounded-xl border border-[var(--line)] hover:bg-[var(--line)] text-[var(--ink)] font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
