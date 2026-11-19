'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  FolderArchive,
  Clock,
  Download,
  Loader2,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';
import Link from 'next/link';

function ConfettiEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const animationDelay = `${Math.random() * 2}s`;
        const size = `${Math.floor(Math.random() * 8 + 6)}px`;
        const colors = ['#864FFE', '#C6F56F', '#83E7EE', '#F9EB57', '#6D1FE2'];
        const bg = colors[i % colors.length];

        return (
          <div
            key={i}
            className="absolute top-0 animate-bounce rounded-full opacity-80"
            style={{
              left,
              width: size,
              height: size,
              backgroundColor: bg,
              animationDuration: `${2 + Math.random() * 2}s`,
              animationDelay,
            }}
          />
        );
      })}
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const orderId = searchParams.get('order_id') || '';
  const gateway = searchParams.get('gateway') || 'stripe';

  const [loading, setLoading] = useState(true);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/billing/session-status?session_id=${encodeURIComponent(sessionId || orderId)}`);
        if (res.ok) {
          const data = await res.json();
          setSessionDetails(data);
          setLoading(false);
        } else if (pollCount < 5) {
          setPollCount((prev) => prev + 1);
          timer = setTimeout(pollStatus, 1500);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    pollStatus();
    return () => clearTimeout(timer);
  }, [sessionId, orderId, pollCount]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center text-center">
      <ConfettiEffect />

      {/* Hero Badge & Heading */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black tracking-wide mb-6">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PAYMENT VERIFIED &bull; PRO ACTIVE
      </div>

      <h1 className="font-heading font-black text-4xl sm:text-5xl text-[var(--ink)] tracking-tight">
        You're officially a SimplifyPDF Pro!
      </h1>
      <p className="text-base sm:text-lg text-[var(--muted)] mt-3 max-w-xl">
        Your high-capacity quota has been provisioned instantly. Enjoy 2GB limits, multi-file batch ZIP studio, and dedicated worker queue priority.
      </p>

      {/* Transaction & Plan Card */}
      <div className="w-full mt-10 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-lg text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
          <div>
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
              Subscription Plan
            </span>
            <div className="flex items-center gap-2.5 mt-1">
              <h2 className="font-heading font-black text-2xl text-[var(--ink)]">
                SimplifyPDF Pro Member
              </h2>
              <Badge variant="pro">ACTIVATED</Badge>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
              Reference ID
            </span>
            <p className="font-mono text-xs text-[var(--ink)] mt-1 truncate max-w-[220px]">
              {sessionId || orderId || 'sub_live_verified'}
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
            <span className="text-xs text-[var(--muted)] font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[var(--primary-500)]" /> Upload Limit
            </span>
            <span className="block font-heading font-black text-xl text-[var(--ink)] mt-1">
              2,048 MB (2 GB)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
            <span className="text-xs text-[var(--muted)] font-semibold flex items-center gap-1.5">
              <FolderArchive className="w-3.5 h-3.5 text-[var(--primary-500)]" /> Batch ZIP Studio
            </span>
            <span className="block font-heading font-black text-xl text-[var(--ink)] mt-1">
              100 Files / Batch
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
            <span className="text-xs text-[var(--muted)] font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--primary-500)]" /> Retention Vault
            </span>
            <span className="block font-heading font-black text-xl text-[var(--ink)] mt-1">
              24-Hour Vault
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="http://localhost:3002/batch"
            className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-[var(--primary-500)] hover:bg-[var(--primary-700)] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span className="text-white">Launch Pro Batch Studio</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </a>

          <Link
            href="/billing"
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-[var(--soft)] hover:bg-[var(--line)] text-[var(--ink)] font-bold text-sm transition-all text-center"
          >
            View Invoices &amp; Receipts
          </Link>
        </div>
      </div>

      {/* Security Footer */}
      <div className="flex items-center gap-2 text-xs text-[var(--muted)] mt-8">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Cryptographically verified payment gateway via {gateway.toUpperCase()}. Instant GST receipt sent to your email.</span>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-500)]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
