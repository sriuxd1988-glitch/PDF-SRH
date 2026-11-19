'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderArchive,
  ArrowLeft,
  Crown,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Badge, ButtonV6 } from '@simplifypdf/ui';
import { BatchUploader } from '../../components/BatchUploader';
import { useApp } from '../../components/DashboardShell';

export default function BatchStudioPage() {
  const { userRole, openUpgradeModal } = useApp();

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner with Pro Account Indicia */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ink)]">
              PRO Multi-File Batch Studio
            </h1>
            {userRole === 'PRO' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold text-xs">
                <Crown className="w-3.5 h-3.5 fill-amber-500" /> SimplifyPDF Pro Active
              </span>
            ) : (
              <Badge variant="neutral">Pro Feature Preview</Badge>
            )}
          </div>
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
            Drop up to 100 documents simultaneously (up to 2,048 MB total payload). All files process in parallel across dedicated permissive worker pools and package into a single consolidated ZIP archive.
          </p>
        </div>

        {userRole === 'PRO' ? (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <span className="block font-black text-emerald-700">⚡ Priority Queue Active</span>
              <span className="block text-[11px] text-[var(--muted)]">Renewal: Dec 20, 2026</span>
            </div>
          </div>
        ) : (
          <div onClick={() => openUpgradeModal('Batch Studio Pro requirement')}>
            <ButtonV6 text="Upgrade to Pro" hoverText="Unlock 2GB Batch" variant="primary" size="md" />
          </div>
        )}
      </div>

      {/* Pro Workspace Features Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-[var(--primary-500)] flex items-center justify-center shrink-0">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--ink)]">100 Files per Batch</h4>
            <p className="text-[11px] text-[var(--muted)]">Consolidated structured ZIP output</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--ink)]">2,048 MB Total Capacitor</h4>
            <p className="text-[11px] text-[var(--muted)]">Direct presigned S3 parallel upload</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--ink)]">24-Hour Vault Retention</h4>
            <p className="text-[11px] text-[var(--muted)]">Manual instant GDPR purge supported</p>
          </div>
        </div>
      </div>

      {/* Main Batch Processor */}
      <BatchUploader />
    </div>
  );
}
