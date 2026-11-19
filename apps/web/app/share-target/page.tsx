'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Share2, FileCheck2 } from 'lucide-react';

export default function ShareTargetPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Receiving shared PDF document...');

  useEffect(() => {
    async function processSharedFile() {
      try {
        if (typeof window !== 'undefined' && 'caches' in window) {
          const cache = await caches.open('simplifypdf-shared-files');
          const response = await cache.match('/shared-pdf-buffer');
          if (response) {
            setStatus('Shared document received! Forwarding to Compress tool...');
            setTimeout(() => {
              router.push('/tools/compress?shared=1');
            }, 800);
            return;
          }
        }
      } catch (err) {
        console.warn('Error reading shared buffer:', err);
      }

      router.push('/tools/compress');
    }

    processSharedFile();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-center text-[var(--primary-500)] mb-4 shadow-sm">
        <Share2 className="w-8 h-8" />
      </div>
      <h1 className="font-heading font-semibold text-2xl text-[var(--ink)] tracking-tight">
        Web Share Target Active
      </h1>
      <p className="text-sm text-[var(--muted)] mt-2 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-[var(--primary-500)]" />
        <span>{status}</span>
      </p>
    </div>
  );
}
