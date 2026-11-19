'use client';

import React from 'react';
import { X, Check, Zap, Shield, FileArchive, Clock, Sparkles } from 'lucide-react';
import { ButtonV6 } from '@simplifypdf/ui';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: string;
}

export function UpgradeModal({ isOpen, onClose, triggerReason }: UpgradeModalProps) {
  if (!isOpen) return null;

  const proFeatures = [
    { title: '2,048 MB (2 GB) File Capacitor', desc: 'Process massive reports, legal bundles, and CAD scans without size errors.' },
    { title: 'Parallel Batch ZIP Studio', desc: 'Drop up to 100 documents simultaneously and download a unified ZIP archive.' },
    { title: 'Dedicated Priority Queue', desc: 'Zero queue waiting. Priority routing to dedicated warm Python workers.' },
    { title: '24-Hour File Retention Vault', desc: 'Files persist for 24 hours with manual one-click instant shred option.' },
    { title: 'Unlimited Multi-Lingual OCR', desc: 'Searchable PDF/A conversion across 6+ languages with 99.4% accuracy.' },
    { title: 'Cryptographic Audit e-Sign', desc: 'Append legal verification certificate sheets with SHA-256 integrity hashes.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[var(--card)] border border-[var(--line)] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[var(--primary-500)]/20 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--lime)] text-neutral-950 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> PRO Upgrade
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight">
            Supercharge Your PDF Productivity
          </h2>
          <p className="text-sm text-[var(--muted)] font-normal mt-1 leading-relaxed">
            {triggerReason || 'Unlock full batch processing, priority queue routing, and 2GB limits.'}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
          {proFeatures.map((feat, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[var(--primary-500)] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--ink)]">{feat.title}</h4>
                <p className="text-[11px] text-[var(--muted)] font-normal mt-0.5">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing & CTA */}
        <div className="p-5 rounded-2xl bg-[var(--secondary)] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-2xl text-white tracking-tight">₹249</span>
              <span className="text-xs text-neutral-400 font-normal">/ month ($4.99 USD)</span>
            </div>
            <p className="text-[11px] text-neutral-400 font-normal mt-0.5">Cancel anytime with 1 click. Zero lock-in.</p>
          </div>

          <div onClick={() => alert('Redirecting to Stripe / Razorpay checkout...')}>
            <ButtonV6 text="Upgrade to Pro Now" hoverText="Instant 2GB Access" variant="primary" size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}
