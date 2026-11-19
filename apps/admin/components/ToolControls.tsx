'use client';

import React, { useState } from 'react';
import { Power, AlertTriangle, CheckCircle, Sliders } from 'lucide-react';

interface ToolItem {
  slug: string;
  name: string;
  category: string;
  isEnabled: boolean;
  isMaintenance: boolean;
}

export function ToolControls() {
  const [tools, setTools] = useState<ToolItem[]>([
    { slug: 'compress', name: 'Compress PDF', category: 'OPTIMIZE', isEnabled: true, isMaintenance: false },
    { slug: 'merge', name: 'Merge PDF', category: 'OPTIMIZE', isEnabled: true, isMaintenance: false },
    { slug: 'split', name: 'Split PDF', category: 'OPTIMIZE', isEnabled: true, isMaintenance: false },
    { slug: 'word-to-pdf', name: 'Word to PDF', category: 'CONVERT', isEnabled: true, isMaintenance: false },
    { slug: 'pdf-to-word', name: 'PDF to Word', category: 'CONVERT', isEnabled: true, isMaintenance: false },
    { slug: 'ocr', name: 'OCR PDF', category: 'CONVERT', isEnabled: true, isMaintenance: false },
    { slug: 'protect', name: 'Protect PDF', category: 'SECURITY', isEnabled: true, isMaintenance: false },
    { slug: 'unlock', name: 'Unlock PDF', category: 'SECURITY', isEnabled: true, isMaintenance: false },
  ]);

  const toggleTool = (slug: string) => {
    setTools(
      tools.map((t) => (t.slug === slug ? { ...t, isEnabled: !t.isEnabled } : t))
    );
  };

  const toggleMaintenance = (slug: string) => {
    setTools(
      tools.map((t) => (t.slug === slug ? { ...t, isMaintenance: !t.isMaintenance } : t))
    );
  };

  return (
    <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)]">
            Tool Circuit Breakers & Kill Switches
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1">
            Instantly disable tools or put them into maintenance mode across the frontend.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" /> All permissive workers healthy
        </span>
      </div>

      <div className="divide-y divide-[var(--line)]">
        {tools.map((tool) => (
          <div key={tool.slug} className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  tool.isEnabled ? (tool.isMaintenance ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-rose-500'
                }`}
              />
              <div>
                <div className="text-sm font-bold text-[var(--ink)]">{tool.name}</div>
                <div className="text-[11px] font-mono text-[var(--muted)]">/tools/{tool.slug}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleMaintenance(tool.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  tool.isMaintenance
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                Maintenance Mode
              </button>

              <button
                onClick={() => toggleTool(tool.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  tool.isEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                <Power className="w-3 h-3" />
                {tool.isEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
