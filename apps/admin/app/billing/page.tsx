'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  RotateCcw,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Search,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';

interface Transaction {
  id: string;
  customer: string;
  email: string;
  amount: string;
  currency: 'INR' | 'USD';
  gateway: 'Razorpay' | 'Stripe';
  status: 'SUCCESS' | 'REFUNDED' | 'FAILED';
  date: string;
  invoicePdf: string;
}

export default function AdminBillingPage() {
  const [search, setSearch] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('20');
  const [coupons, setCoupons] = useState([
    { code: 'LAUNCH50', discount: '50% OFF', redemptions: 142, active: true },
    { code: 'STUDENT20', discount: '20% OFF', redemptions: 89, active: true },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_rzp_9841',
      customer: 'Priya Sharma',
      email: 'priya.legal@mumbai-law.in',
      amount: '₹249.00',
      currency: 'INR',
      gateway: 'Razorpay',
      status: 'SUCCESS',
      date: 'Today, 14:20',
      invoicePdf: '#',
    },
    {
      id: 'tx_strp_1042',
      customer: 'Sarah Connor',
      email: 'sarah.c@techcorp.io',
      amount: '$4.99',
      currency: 'USD',
      gateway: 'Stripe',
      status: 'SUCCESS',
      date: 'Yesterday, 19:45',
      invoicePdf: '#',
    },
    {
      id: 'tx_rzp_7731',
      customer: 'Amit Patel',
      email: 'amit.patel@gujarat.in',
      amount: '₹249.00',
      currency: 'INR',
      gateway: 'Razorpay',
      status: 'SUCCESS',
      date: 'Nov 18, 2025',
      invoicePdf: '#',
    },
    {
      id: 'tx_strp_8819',
      customer: 'David Kim',
      email: 'david.k@korea-agency.com',
      amount: '$4.99',
      currency: 'USD',
      gateway: 'Stripe',
      status: 'REFUNDED',
      date: 'Nov 16, 2025',
      invoicePdf: '#',
    },
  ]);

  const handleRefund = (txId: string, customer: string) => {
    const reason = prompt(`Issue full refund for transaction ${txId} (${customer})?\nEnter refund reason:`, 'Customer request / dissatisfaction');
    if (!reason) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'REFUNDED' } : t))
    );
    alert(`Refund issued via Payment Gateway API for ${txId}.\nReason logged: "${reason}".\nUser tier automatically downgraded to Free.`);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setCoupons((prev) => [
      { code: couponCode.toUpperCase(), discount: `${couponDiscount}% OFF`, redemptions: 0, active: true },
      ...prev,
    ]);
    alert(`Coupon ${couponCode.toUpperCase()} created and published to checkout.`);
    setCouponCode('');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text- tracking-tight sm:text-3xl text-[var(--ink)]">
              Billing Operations &amp; Gateway Management
            </h1>
            <Badge variant="live" dot>RAZORPAY + STRIPE</Badge>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
            Monitor real-time subscription health across Stripe (USD) and Razorpay (INR), issue audited refunds, and create promotional discount codes.
          </p>
        </div>
      </div>

      {/* Revenue & Multi-Currency Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
            Total MRR (Blended)
          </span>
          <div className="font-heading font-bold text- tracking-tight text-[var(--ink)] mt-2">
            ₹1,42,850
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            ↑ 24.5% MoM net growth
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
            Razorpay Subscriptions (INR)
          </span>
          <div className="font-heading font-bold text- tracking-tight text-[var(--ink)] mt-2">
            395 Active
          </div>
          <span className="text-xs text-[var(--muted)] font-semibold mt-1 inline-block">
            Auto-debit recurring e-mandates
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
            Stripe Subscriptions (USD)
          </span>
          <div className="font-heading font-bold text- tracking-tight text-[var(--ink)] mt-2">
            108 Active
          </div>
          <span className="text-xs text-[var(--muted)] font-semibold mt-1 inline-block">
            Global credit card billing
          </span>
        </div>
      </div>

      {/* Coupons & Promo Codes Engine */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)]">
              Promotional Coupons &amp; Discount Codes
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Active codes applied during checkout on public pricing and upgrade modals.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateCoupon} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Coupon Code (e.g. FLASH30)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold uppercase text-[var(--ink)] outline-none focus:border-[var(--primary-500)]"
          />
          <select
            value={couponDiscount}
            onChange={(e) => setCouponDiscount(e.target.value)}
            className="w-full sm:w-40 px-3 py-2.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
          >
            <option value="10">10% Discount</option>
            <option value="20">20% Discount</option>
            <option value="30">30% Discount</option>
            <option value="50">50% Discount</option>
          </select>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Create Coupon</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          {coupons.map((c, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex items-center gap-3">
              <Tag className="w-4 h-4 text-[var(--primary-500)]" />
              <div>
                <span className="font-mono font-semibold text-xs text-[var(--ink)] block">{c.code}</span>
                <span className="text-[10px] text-[var(--muted)]">{c.discount} · {c.redemptions} redeemed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions & Invoices Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)]">
            Recent Payment Transactions
          </h3>
          <span className="text-xs font-bold text-[var(--muted)]">
            {transactions.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider font-bold">
                <th className="pb-3.5 pl-2">Transaction ID</th>
                <th className="pb-3.5">Customer</th>
                <th className="pb-3.5">Gateway</th>
                <th className="pb-3.5">Amount</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5">Date</th>
                <th className="pb-3.5 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] font-medium">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[var(--soft)]/50 transition-colors">
                  <td className="py-4 pl-2 font-mono font-bold text-[var(--ink)] flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[var(--primary-500)]" />
                    <span>{tx.id}</span>
                  </td>

                  <td className="py-4">
                    <span className="font-bold text-[var(--ink)] block">{tx.customer}</span>
                    <span className="text-[11px] text-[var(--muted)]">{tx.email}</span>
                  </td>

                  <td className="py-4">
                    <span className="font-bold text-[var(--ink)]">{tx.gateway}</span>
                  </td>

                  <td className="py-4 font-mono font-bold text-[var(--ink)]">{tx.amount}</td>

                  <td className="py-4">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        tx.status === 'SUCCESS'
                          ? 'text-emerald-700 bg-emerald-500/10'
                          : tx.status === 'REFUNDED'
                          ? 'text-amber-700 bg-amber-500/10'
                          : 'text-rose-700 bg-rose-500/10'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-4 text-[var(--muted)]">{tx.date}</td>

                  <td className="py-4 text-right pr-2">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => alert(`Downloading official VAT invoice for ${tx.id}`)}
                        className="px-2.5 py-1.5 rounded-xl border border-[var(--line)] hover:bg-[var(--line)] text-xs font-bold inline-flex items-center gap-1"
                        title="Download Invoice PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>

                      {tx.status === 'SUCCESS' && (
                        <button
                          onClick={() => handleRefund(tx.id, tx.customer)}
                          className="px-2.5 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Refund</span>
                        </button>
                      )}
                    </div>
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
