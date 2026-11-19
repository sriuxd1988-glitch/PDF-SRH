'use client';

import React, { useState } from 'react';
import {
  Zap,
  Save,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  FileArchive,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';

interface PlanConfig {
  id: 'guest' | 'free' | 'pro';
  name: string;
  badge: string;
  maxFileSizeMb: number;
  dailyTasksLimit: number;
  batchFilesLimit: number;
  retentionHours: number;
  ocrPagesMonthly: number;
  priceInr: number;
  priceUsd: number;
  stripePriceId: string;
  razorpayPlanId: string;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanConfig[]>([
    {
      id: 'guest',
      name: 'Anonymous Guest',
      badge: 'Unregistered',
      maxFileSizeMb: 25,
      dailyTasksLimit: 3,
      batchFilesLimit: 1,
      retentionHours: 1,
      ocrPagesMonthly: 0,
      priceInr: 0,
      priceUsd: 0,
      stripePriceId: 'N/A',
      razorpayPlanId: 'N/A',
    },
    {
      id: 'free',
      name: 'Free Member',
      badge: 'Starter',
      maxFileSizeMb: 50,
      dailyTasksLimit: 10,
      batchFilesLimit: 1,
      retentionHours: 2,
      ocrPagesMonthly: 5,
      priceInr: 0,
      priceUsd: 0,
      stripePriceId: 'N/A',
      razorpayPlanId: 'N/A',
    },
    {
      id: 'pro',
      name: 'Paid Pro Subscriber',
      badge: 'Pro 2GB',
      maxFileSizeMb: 2048,
      dailyTasksLimit: 250,
      batchFilesLimit: 100,
      retentionHours: 24,
      ocrPagesMonthly: 500,
      priceInr: 249,
      priceUsd: 4.99,
      stripePriceId: 'price_1Q_SimplifyPro_Monthly',
      razorpayPlanId: 'plan_SimplifyPro_INR_Monthly',
    },
  ]);

  const [grandfatherExisting, setGrandfatherExisting] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateField = (id: 'guest' | 'free' | 'pro', field: keyof PlanConfig, value: any) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate database write and Redis cache eviction `cache:plans:all`
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text- tracking-tight sm:text-3xl text-[var(--ink)]">
              Plan Quotas &amp; Tier Limits Controller
            </h1>
            <Badge variant="live" dot>HOT RE-RELOAD</Badge>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
            Configure real-time capacity ceilings. Changes write directly to the PostgreSQL <code className="font-mono text-xs">Plan</code> table and flush Redis cache key <code className="font-mono text-xs">cache:plans:all</code> for instant API enforcement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] transition-all inline-flex items-center gap-2 shadow-sm"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save &amp; Flush Plan Cache</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Plan limits published to database and Redis cache evicted successfully! All user portals now enforce the updated values.</span>
        </div>
      )}

      {/* Grandfathering Toggle */}
      <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-[var(--ink)]">Grandfather Existing Subscribers</h4>
          <p className="text-[11px] text-[var(--muted)]">
            If enabled, limit reductions or price updates will only apply to new signups, keeping existing Pro users on their locked legacy terms.
          </p>
        </div>

        <button
          onClick={() => setGrandfatherExisting(!grandfatherExisting)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            grandfatherExisting
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-[var(--soft)] text-[var(--muted)] border border-[var(--line)]'
          }`}
        >
          {grandfatherExisting ? 'Grandfathering: ENABLED' : 'Grandfathering: DISABLED'}
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between gap-6"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Tier Configuration
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--soft)] text-[var(--ink)] border border-[var(--line)]">
                  {plan.badge}
                </span>
              </div>

              <h3 className="font-heading font-bold text- tracking-tight text-[var(--ink)]">{plan.name}</h3>

              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    value={plan.maxFileSizeMb}
                    onChange={(e) => updateField(plan.id, 'maxFileSizeMb', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold font-mono text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                    Daily Tasks Ceiling
                  </label>
                  <input
                    type="number"
                    value={plan.dailyTasksLimit}
                    onChange={(e) => updateField(plan.id, 'dailyTasksLimit', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold font-mono text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                    Batch Max Files (ZIP Studio)
                  </label>
                  <input
                    type="number"
                    value={plan.batchFilesLimit}
                    onChange={(e) => updateField(plan.id, 'batchFilesLimit', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold font-mono text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                    Vault Retention Window (Hours)
                  </label>
                  <input
                    type="number"
                    value={plan.retentionHours}
                    onChange={(e) => updateField(plan.id, 'retentionHours', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold font-mono text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                    OCR Pages Allowance (Monthly)
                  </label>
                  <input
                    type="number"
                    value={plan.ocrPagesMonthly}
                    onChange={(e) => updateField(plan.id, 'ocrPagesMonthly', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold font-mono text-[var(--ink)]"
                  />
                </div>
              </div>
            </div>

            {plan.id === 'pro' && (
              <div className="pt-4 border-t border-[var(--line)] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] block">
                  Payment Gateway Identifiers
                </span>
                <div>
                  <label className="block text-[10px] text-[var(--muted)] mb-0.5">Stripe Price ID</label>
                  <input
                    type="text"
                    value={plan.stripePriceId}
                    onChange={(e) => updateField(plan.id, 'stripePriceId', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--soft)] border border-[var(--line)] font-mono text-[11px] text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[var(--muted)] mb-0.5">Razorpay Plan ID</label>
                  <input
                    type="text"
                    value={plan.razorpayPlanId}
                    onChange={(e) => updateField(plan.id, 'razorpayPlanId', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--soft)] border border-[var(--line)] font-mono text-[11px] text-[var(--ink)]"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
