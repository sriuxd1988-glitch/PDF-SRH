'use client';

import React, { useState } from 'react';
import {
  Navigation,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  ArrowRight,
  GripVertical,
} from 'lucide-react';
import { BuilderEngine } from '../../../components/builder/BuilderEngine';

interface NavLink {
  id: string;
  label: string;
  url: string;
  isMegaMenu?: boolean;
}

export default function HeaderBuilderPage() {
  const [brandName, setBrandName] = useState('SimplifyPDF');
  const [ctaText, setCtaText] = useState('Get Started');
  const [ctaUrl, setCtaUrl] = useState('/pricing');
  const [navLinks, setNavLinks] = useState<NavLink[]>([
    { id: '1', label: 'All Tools', url: '/tools', isMegaMenu: true },
    { id: '2', label: 'Security & Trust', url: '/security' },
    { id: '3', label: 'Pricing Plans', url: '/pricing' },
    { id: '4', label: 'Guides & Blog', url: '/blog' },
  ]);

  const addNavLink = () => {
    const newId = String(Date.now());
    setNavLinks([...navLinks, { id: newId, label: 'New Link', url: '/' }]);
  };

  const removeNavLink = (id: string) => {
    setNavLinks(navLinks.filter((n) => n.id !== id));
  };

  const updateNavLink = (id: string, field: keyof NavLink, val: any) => {
    setNavLinks(navLinks.map((n) => (n.id === id ? { ...n, [field]: val } : n)));
  };

  const handlePublish = () => {
    console.log('Publishing header config to database & cache:config:header');
  };

  return (
    <BuilderEngine
      title="Header &amp; Navigation Builder"
      subtitle="Visual designer for logo branding, top menu links, tool mega-menu, and primary roll CTA."
      onPublish={handlePublish}
    >
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        {/* Brand & Logo Settings */}
        <div>
          <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)] mb-1">
            Brand Identity
          </h3>
          <p className="text-xs text-[var(--muted)] mb-4">
            Text brandmark and visual SVG logo displayed in the top bar.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Brand Title
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
              />
            </div>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="pt-4 border-t border-[var(--line)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)]">
                Header Menu Links
              </h3>
              <p className="text-xs text-[var(--muted)]">Manage top navigation hierarchy</p>
            </div>
            <button
              onClick={addNavLink}
              className="px-3 py-1.5 rounded-xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] inline-flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-3">
            {navLinks.map((link) => (
              <div
                key={link.id}
                className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-between gap-3"
              >
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateNavLink(link.id, 'label', e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
                    placeholder="Link Label"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateNavLink(link.id, 'url', e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--line)] text-xs font-mono text-[var(--muted)]"
                    placeholder="/url-slug"
                  />
                </div>

                <button
                  onClick={() => removeNavLink(link.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  title="Remove Link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Header CTA Settings */}
        <div className="pt-4 border-t border-[var(--line)]">
          <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)] mb-1">
            Primary Action Button (.btn-v6)
          </h3>
          <p className="text-xs text-[var(--muted)] mb-4">
            Styled with Nuvexa violet gradient and guaranteed pure white text (`#FFFFFF`).
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Target URL
              </label>
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-mono text-[var(--muted)]"
              />
            </div>
          </div>
        </div>
      </div>
    </BuilderEngine>
  );
}
