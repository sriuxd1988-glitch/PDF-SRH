'use client';

import React, { useState } from 'react';
import { DropZone } from '../../../components/DropZone';
import { ShieldCheck, Sparkles, ArrowLeft, Sliders, Lock, Scissors } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@simplifypdf/ui';

interface ToolViewProps {
  slug: string;
  tool: {
    title: string;
    toolType: string;
    desc: string;
    maxMb: number;
    tips: string[];
  };
}

export function ToolView({ slug, tool }: ToolViewProps) {
  const [compressLevel, setCompressLevel] = useState<'basic' | 'recommended' | 'extreme'>('recommended');
  const [password, setPassword] = useState('');
  const [pageRange, setPageRange] = useState('');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
      <div className="flex items-center gap-2">
        <Link
          href="/#tools"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all tools
        </Link>
      </div>

      <div className="text-center flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-500)] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" /> High-Speed Permissive Engine
        </div>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[var(--ink)] tracking-tight">
          {tool.title}
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted)] font-normal max-w-xl leading-relaxed">
          {tool.desc}
        </p>
      </div>

      {/* Tool Specific Options Panel */}
      {slug === 'compress' && (
        <div className="max-w-md mx-auto w-full p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            <Sliders className="w-3.5 h-3.5 text-[var(--primary-500)]" />
            <span>Compression Level</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'basic', label: 'Basic', desc: 'No quality loss' },
              { id: 'recommended', label: 'Good', desc: 'Best balance' },
              { id: 'extreme', label: 'Extreme', desc: 'Max squeeze' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setCompressLevel(lvl.id as any)}
                className={`p-2.5 rounded-xl text-center text-xs font-medium transition-all border ${
                  compressLevel === lvl.id
                    ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-500)] font-semibold'
                    : 'border-[var(--line)] bg-[var(--soft)] text-[var(--muted)]'
                }`}
              >
                <div>{lvl.label}</div>
                <div className="text-[10px] opacity-75">{lvl.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {slug === 'protect' && (
        <div className="max-w-md mx-auto w-full p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            <Lock className="w-3.5 h-3.5 text-[var(--primary-500)]" />
            <span>Set 256-bit AES Password</span>
          </div>
          <input
            type="password"
            placeholder="Enter secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
          />
        </div>
      )}

      {slug === 'split' && (
        <div className="max-w-md mx-auto w-full p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            <Scissors className="w-3.5 h-3.5 text-[var(--primary-500)]" />
            <span>Page Range Selection</span>
          </div>
          <input
            type="text"
            placeholder="e.g. 1-3, 5, 8-10 (Leave empty to extract all pages)"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
          />
        </div>
      )}

      <DropZone
        toolType={tool.toolType}
        toolTitle={`Drop file to ${tool.title}`}
        maxFileSizeMb={tool.maxMb}
      />

      {/* Feature & Security Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[var(--line)]">
        {tool.tips.map((tip, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex items-start gap-3 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold text-[var(--ink)]">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
