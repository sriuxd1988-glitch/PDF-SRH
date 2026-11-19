'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Globe,
} from 'lucide-react';
import { BuilderEngine } from '../../../components/builder/BuilderEngine';

interface FooterColumn {
  id: string;
  title: string;
  links: { label: string; url: string }[];
}

export default function FooterBuilderPage() {
  const [copyrightLine, setCopyrightLine] = useState('© {YEAR} SimplifyPDF. All rights reserved. 100% Permissive Open-Source PDF Platform.');
  const [sslBadge, setSslBadge] = useState(true);
  const [gdprBadge, setGdprBadge] = useState(true);
  const [dpdpBadge, setDpdpBadge] = useState(true);

  const [columns, setColumns] = useState<FooterColumn[]>([
    {
      id: 'c1',
      title: 'Popular Tools',
      links: [
        { label: 'Compress PDF', url: '/tools/compress' },
        { label: 'Merge PDF', url: '/tools/merge' },
        { label: 'Split PDF', url: '/tools/split' },
        { label: 'e-Sign PDF', url: '/tools/esign' },
      ],
    },
    {
      id: 'c2',
      title: 'Company',
      links: [
        { label: 'About Us', url: '/about' },
        { label: 'Security & Trust', url: '/security' },
        { label: 'Pricing Plans', url: '/pricing' },
        { label: 'Guides & Blog', url: '/blog' },
      ],
    },
    {
      id: 'c3',
      title: 'Legal & Privacy',
      links: [
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Cookie Preferences', url: '#' },
        { label: 'DPDP & GDPR Compliance', url: '/security' },
      ],
    },
  ]);

  const addColumn = () => {
    if (columns.length >= 4) {
      alert('Maximum 4 footer columns supported.');
      return;
    }
    const newId = `c${Date.now()}`;
    setColumns([...columns, { id: newId, title: 'New Column', links: [{ label: 'Link 1', url: '/' }] }]);
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter((c) => c.id !== id));
  };

  const handlePublish = () => {
    console.log('Publishing footer configuration to database and cache:config:footer');
  };

  return (
    <BuilderEngine
      title="Footer Builder"
      subtitle="Visual designer for 4 link columns, copyright notices, social networks, and trust certifications."
      onPublish={handlePublish}
    >
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        {/* Link Columns Manager */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)]">
                Navigation Columns ({columns.length}/4)
              </h3>
              <p className="text-xs text-[var(--muted)]">Manage link columns rendered across the website</p>
            </div>
            {columns.length < 4 && (
              <button
                onClick={addColumn}
                className="px-3 py-1.5 rounded-xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] inline-flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Column</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {columns.map((col) => (
              <div
                key={col.id}
                className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) =>
                      setColumns(
                        columns.map((c) => (c.id === col.id ? { ...c, title: e.target.value } : c))
                      )
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--line)] text-xs font-bold text-[var(--ink)] w-48"
                  />
                  <button
                    onClick={() => removeColumn(col.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[var(--muted)] pl-1">
                  {col.links.length} links configured
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright Line */}
        <div className="pt-4 border-t border-[var(--line)]">
          <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)] mb-1">
            Copyright &amp; Legal Line
          </h3>
          <p className="text-xs text-[var(--muted)] mb-3">
            The token <code className="font-mono text-xs">{'{YEAR}'}</code> automatically renders the dynamic current year.
          </p>
          <input
            type="text"
            value={copyrightLine}
            onChange={(e) => setCopyrightLine(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)]"
          />
        </div>

        {/* Trust Badges Settings */}
        <div className="pt-4 border-t border-[var(--line)]">
          <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)] mb-1">
            Compliance &amp; Trust Badges
          </h3>
          <p className="text-xs text-[var(--muted)] mb-3">
            Toggle trust verification badges in the lower footer band.
          </p>

          <div className="space-y-2 text-xs font-bold">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sslBadge}
                onChange={(e) => setSslBadge(e.target.checked)}
                className="accent-[var(--primary-500)]"
              />
              <span>256-Bit SSL AES Encryption Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={gdprBadge}
                onChange={(e) => setGdprBadge(e.target.checked)}
                className="accent-[var(--primary-500)]"
              />
              <span>GDPR Article 17 Right to Erasure Ready</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dpdpBadge}
                onChange={(e) => setDpdpBadge(e.target.checked)}
                className="accent-[var(--primary-500)]"
              />
              <span>India DPDP Act 2023 Compliant</span>
            </label>
          </div>
        </div>
      </div>
    </BuilderEngine>
  );
}
