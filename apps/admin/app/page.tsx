'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Users,
  CreditCard,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  Palette,
  FileText,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';

export default function AdminOverviewPage() {
  const kpis = [
    {
      title: 'Active Visitors',
      value: '428',
      change: '+18% vs last hour',
      isPositive: true,
      subtext: 'Live Redis heartbeat tracking',
      icon: Users,
    },
    {
      title: 'Monthly Recurring Revenue',
      value: '₹1,42,850',
      change: '+24.5% MoM',
      isPositive: true,
      subtext: '$1,720 USD equivalent',
      icon: CreditCard,
    },
    {
      title: 'Tasks Processed (Today)',
      value: '3,842',
      change: '+11% vs yesterday',
      isPositive: true,
      subtext: '72% Free · 28% Pro Priority',
      icon: Activity,
    },
    {
      title: 'Free-to-Paid Conversion',
      value: '4.82%',
      change: '+0.6% this week',
      isPositive: true,
      subtext: 'Triggered from 50MB limit banner',
      icon: TrendingUp,
    },
    {
      title: 'Worker Error Rate',
      value: '0.04%',
      change: '-0.02% decrease',
      isPositive: true,
      subtext: 'Permissive python pool (0 DLQ)',
      icon: Cpu,
    },
  ];

  const toolVolumes = [
    { name: 'Compress PDF', volume: 1420, percent: '37%', status: 'Healthy', time: '1.2s' },
    { name: 'Merge PDF', volume: 840, percent: '22%', status: 'Healthy', time: '0.8s' },
    { name: 'Word to PDF (LibreOffice)', volume: 512, percent: '13%', status: 'Lock Active', time: '4.1s' },
    { name: 'OCR Searchable PDF/A', volume: 420, percent: '11%', status: 'Healthy', time: '6.4s' },
    { name: 'e-Sign & Audit Sheet', volume: 380, percent: '10%', status: 'Healthy', time: '1.6s' },
    { name: 'AES-256 Protect / Redact', volume: 270, percent: '7%', status: 'Healthy', time: '0.9s' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ink)]">
              Executive Command Center
            </h1>
            <Badge variant="live" dot>SYSTEMS OPERATIONAL</Badge>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
            Real-time observability across permissive worker clusters, S3 auto-shred lifecycles, payment webhooks, and live design token propagation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/design"
            className="px-5 py-2.5 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <Palette className="w-4 h-4 text-white" />
            <span>Design Studio</span>
          </Link>
          <Link
            href="/tools"
            className="px-5 py-2.5 rounded-2xl bg-[var(--secondary)] text-white font-bold text-xs hover:bg-black transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <Sliders className="w-4 h-4 text-white" />
            <span>Tool Switches</span>
          </Link>
        </div>
      </div>

      {/* 5-Column Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] mb-2">
                  <span>{kpi.title}</span>
                  <Icon className="w-4 h-4 text-[var(--primary-500)]" />
                </div>
                <div className="font-heading font-black text-2xl text-[var(--ink)]">
                  {kpi.value}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--line)]">
                <span className="text-xs font-bold text-emerald-600 block">
                  {kpi.change}
                </span>
                <span className="text-[10px] text-[var(--muted)] block mt-0.5">
                  {kpi.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytical Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tool Conversion Volumes */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-black text-xl text-[var(--ink)]">
                  Daily Conversion Volumes by Tool
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Aggregate execution count and latency across permissive engines.
                </p>
              </div>
              <Link href="/tools" className="text-xs font-bold text-[var(--primary-500)] hover:underline">
                Manage Tools →
              </Link>
            </div>

            <div className="space-y-4">
              {toolVolumes.map((tool, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--ink)]">{tool.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[var(--muted)]">{tool.volume} jobs ({tool.percent})</span>
                      <span className="font-mono font-bold text-emerald-600">{tool.time}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--soft)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary-500)] rounded-full transition-all"
                      style={{ width: tool.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> LibreOffice semaphore: 1/1 active
            </span>
            <span>Total execution: 3,842 operations</span>
          </div>
        </div>

        {/* Revenue & Multi-Currency Trajectory */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-black text-xl text-[var(--ink)]">
                Revenue Trajectory
              </h3>
              <Badge variant="pro">24.5% GROWTH</Badge>
            </div>
            <p className="text-xs text-[var(--muted)] mb-6">
              Active subscriptions tracked across Razorpay (India) &amp; Stripe (Global).
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[var(--muted)] uppercase">Razorpay (India - INR)</span>
                  <div className="font-heading font-black text-xl text-[var(--ink)] mt-0.5">₹98,400</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">395 Active Subscribers</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                  ₹ INR
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[var(--muted)] uppercase">Stripe (Global - USD)</span>
                  <div className="font-heading font-black text-xl text-[var(--ink)] mt-0.5">$535.50</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">108 Active Subscribers</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-[var(--primary-500)] flex items-center justify-center font-bold text-xs">
                  $ USD
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--line)]">
            <Link
              href="/billing"
              className="text-xs font-bold text-[var(--primary-500)] hover:underline inline-flex items-center gap-1"
            >
              <span>View Invoices &amp; Refund Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
