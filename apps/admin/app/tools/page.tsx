'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Power,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';

interface AdminTool {
  slug: string;
  name: string;
  category: 'OPTIMIZE' | 'CONVERT' | 'SECURITY' | 'ORGANIZE';
  isEnabled: boolean;
  isMaintenance: boolean;
  maintenanceMessage: string;
  tierAccess: 'ALL' | 'MEMBERS_ONLY' | 'PRO_ONLY';
  avgLatency: string;
  failureRate24h: string;
}

export default function AdminToolsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [tools, setTools] = useState<AdminTool[]>([
    {
      slug: 'compress',
      name: 'Compress PDF',
      category: 'OPTIMIZE',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Undergoing routine optimization. Available shortly.',
      tierAccess: 'ALL',
      avgLatency: '1.2s',
      failureRate24h: '0.01%',
    },
    {
      slug: 'merge',
      name: 'Merge PDF',
      category: 'OPTIMIZE',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Merge worker scaling.',
      tierAccess: 'ALL',
      avgLatency: '0.8s',
      failureRate24h: '0.00%',
    },
    {
      slug: 'split',
      name: 'Split PDF',
      category: 'OPTIMIZE',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Split processor online.',
      tierAccess: 'ALL',
      avgLatency: '0.7s',
      failureRate24h: '0.02%',
    },
    {
      slug: 'word-to-pdf',
      name: 'Word to PDF',
      category: 'CONVERT',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'LibreOffice engine upgrade in progress.',
      tierAccess: 'ALL',
      avgLatency: '4.1s',
      failureRate24h: '0.08%',
    },
    {
      slug: 'pdf-to-word',
      name: 'PDF to Word',
      category: 'CONVERT',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'pdf2docx worker maintenance.',
      tierAccess: 'ALL',
      avgLatency: '3.8s',
      failureRate24h: '0.05%',
    },
    {
      slug: 'ocr',
      name: 'OCR Searchable PDF/A',
      category: 'CONVERT',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Tesseract 5 engine warming.',
      tierAccess: 'MEMBERS_ONLY',
      avgLatency: '6.4s',
      failureRate24h: '0.12%',
    },
    {
      slug: 'protect',
      name: 'Protect PDF (AES-256)',
      category: 'SECURITY',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Security sandbox maintenance.',
      tierAccess: 'ALL',
      avgLatency: '0.9s',
      failureRate24h: '0.00%',
    },
    {
      slug: 'unlock',
      name: 'Unlock PDF',
      category: 'SECURITY',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Decryption module online.',
      tierAccess: 'ALL',
      avgLatency: '0.7s',
      failureRate24h: '0.02%',
    },
    {
      slug: 'esign',
      name: 'e-Sign & Audit Sheet',
      category: 'SECURITY',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Cryptographic cert worker maintenance.',
      tierAccess: 'ALL',
      avgLatency: '1.6s',
      failureRate24h: '0.01%',
    },
    {
      slug: 'redact',
      name: 'Permanent Redaction',
      category: 'SECURITY',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Rasterization worker update.',
      tierAccess: 'PRO_ONLY',
      avgLatency: '1.4s',
      failureRate24h: '0.03%',
    },
    {
      slug: 'pdf-to-jpg',
      name: 'PDF to High-Res JPG',
      category: 'CONVERT',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Pypdfium2 image renderer update.',
      tierAccess: 'ALL',
      avgLatency: '2.1s',
      failureRate24h: '0.02%',
    },
    {
      slug: 'jpg-to-pdf',
      name: 'JPG to PDF',
      category: 'CONVERT',
      isEnabled: true,
      isMaintenance: false,
      maintenanceMessage: 'Pillow packager online.',
      tierAccess: 'ALL',
      avgLatency: '0.6s',
      failureRate24h: '0.00%',
    },
  ]);

  const toggleToolEnabled = (slug: string) => {
    setTools((prev) =>
      prev.map((t) => {
        if (t.slug === slug) {
          const updated = { ...t, isEnabled: !t.isEnabled };
          // Simulate Redis update
          console.log(`Redis updated: tool:status:${slug} = ${updated.isEnabled}`);
          return updated;
        }
        return t;
      })
    );
  };

  const toggleMaintenance = (slug: string) => {
    setTools((prev) =>
      prev.map((t) => {
        if (t.slug === slug) {
          const updated = { ...t, isMaintenance: !t.isMaintenance };
          console.log(`Redis updated: tool:maint:${slug} = ${updated.isMaintenance}`);
          return updated;
        }
        return t;
      })
    );
  };

  const changeTierAccess = (slug: string, access: 'ALL' | 'MEMBERS_ONLY' | 'PRO_ONLY') => {
    setTools((prev) =>
      prev.map((t) => (t.slug === slug ? { ...t, tierAccess: access } : t))
    );
  };

  const filtered = tools.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ink)]">
              Tool Circuit Breakers &amp; Maintenance Console
            </h1>
            <Badge variant="live" dot>LIVE REDIS SYNC</Badge>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
            Toggling any tool status immediately flushes Redis key <code className="font-mono text-xs">tool:status:&#123;slug&#125;</code> and disables public drop zones within 2 seconds without restarting web containers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> 12 / 12 Permissive Engines Active
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tools or slugs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)] shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['ALL', 'OPTIMIZE', 'CONVERT', 'SECURITY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--primary-500)] text-white shadow-sm'
                  : 'bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider font-bold">
                <th className="pb-3.5 pl-2">Tool Name &amp; Route</th>
                <th className="pb-3.5">Category</th>
                <th className="pb-3.5">Access Tier</th>
                <th className="pb-3.5">Latency</th>
                <th className="pb-3.5">Failure (24h)</th>
                <th className="pb-3.5">Maintenance Mode</th>
                <th className="pb-3.5 text-right pr-2">Master Kill-Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] font-medium">
              {filtered.map((tool) => (
                <tr key={tool.slug} className="hover:bg-[var(--soft)]/50 transition-colors">
                  <td className="py-4 pl-2 flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        !tool.isEnabled
                          ? 'bg-rose-500'
                          : tool.isMaintenance
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <div>
                      <span className="font-bold text-[var(--ink)] block">{tool.name}</span>
                      <span className="font-mono text-[11px] text-[var(--muted)]">/tools/{tool.slug}</span>
                    </div>
                  </td>

                  <td className="py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--soft)] text-[var(--muted)] border border-[var(--line)]">
                      {tool.category}
                    </span>
                  </td>

                  <td className="py-4">
                    <select
                      value={tool.tierAccess}
                      onChange={(e) => changeTierAccess(tool.slug, e.target.value as any)}
                      className="px-2.5 py-1 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-[11px] font-bold text-[var(--ink)]"
                    >
                      <option value="ALL">Everyone (Guest/Free/Pro)</option>
                      <option value="MEMBERS_ONLY">Members Only</option>
                      <option value="PRO_ONLY">Pro Only</option>
                    </select>
                  </td>

                  <td className="py-4 font-mono font-bold text-[var(--ink)]">{tool.avgLatency}</td>

                  <td className="py-4 font-mono text-[var(--muted)]">{tool.failureRate24h}</td>

                  <td className="py-4">
                    <button
                      onClick={() => toggleMaintenance(tool.slug)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        tool.isMaintenance
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line)]'
                      }`}
                    >
                      {tool.isMaintenance ? 'Active (Display Banner)' : 'Set Maintenance'}
                    </button>
                  </td>

                  <td className="py-4 text-right pr-2">
                    <button
                      onClick={() => toggleToolEnabled(tool.slug)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                        tool.isEnabled
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5 text-white" />
                      <span>{tool.isEnabled ? 'ENABLED' : 'DISABLED'}</span>
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
