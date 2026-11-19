'use client';

import React, { useState } from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit3,
  HelpCircle,
  Sparkles,
  LayoutTemplate,
  Plus,
  Trash2,
} from 'lucide-react';
import { BuilderEngine } from '../../../components/builder/BuilderEngine';

interface SectionBlock {
  id: string;
  name: string;
  type: string;
  isVisible: boolean;
}

export default function HomepageBuilderPage() {
  const [sections, setSections] = useState<SectionBlock[]>([
    { id: 'sec-1', name: 'Hero Headline & Quick Launcher', type: 'HERO', isVisible: true },
    { id: 'sec-2', name: 'Universal Interactive Drop Zone', type: 'DROPZONE', isVisible: true },
    { id: 'sec-3', name: 'Product Stats & Engine Verifications', type: 'STATS', isVisible: true },
    { id: 'sec-4', name: 'Top PDF Features Grid (4 Cards)', type: 'FEATURES', isVisible: true },
    { id: 'sec-5', name: 'Extreme Compression Highlight Showcase', type: 'COMPRESSION', isVisible: true },
    { id: 'sec-6', name: '4-Step Interactive How It Works', type: 'HOW_IT_WORKS', isVisible: true },
    { id: 'sec-7', name: 'Competitor Comparison Table (Nuvexa)', type: 'COMPARISON', isVisible: true },
    { id: 'sec-8', name: 'Free vs Pro Pricing Matrix', type: 'PRICING', isVisible: true },
    { id: 'sec-9', name: 'FAQ Accordion (JSON-LD FAQPage Schema)', type: 'FAQ', isVisible: true },
    { id: 'sec-10', name: 'Latest Guides & Blog Articles', type: 'BLOG', isVisible: true },
    { id: 'sec-11', name: 'Final Conversion CTA Banner', type: 'CTA_BANNER', isVisible: true },
  ]);

  const [heroTitle, setHeroTitle] = useState('Simplify Your PDF Workflow');
  const [heroSubtitle, setHeroSubtitle] = useState('High-speed, browser-direct document utility platform powered by 100% permissive open-source engines.');

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setSections(updated);
  };

  const toggleVisibility = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s))
    );
  };

  const handlePublish = () => {
    console.log('Publishing homepage section configuration to database and cache:config:page:home');
  };

  return (
    <BuilderEngine
      title="Homepage Sections Builder"
      subtitle="Visual drag-and-drop block organizer for all 11 homepage sections and hero headlines."
      onPublish={handlePublish}
    >
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        {/* Hero Section Copy Editor */}
        <div>
          <h3 className="font-heading font-black text-lg text-[var(--ink)] mb-1">
            Hero Section Copy
          </h3>
          <p className="text-xs text-[var(--muted)] mb-3">
            Primary title and value proposition rendered in the viewport fold.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Sub-headline Description
              </label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)]"
              />
            </div>
          </div>
        </div>

        {/* Section Reordering List */}
        <div className="pt-4 border-t border-[var(--line)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-black text-lg text-[var(--ink)]">
                Section Layout Order ({sections.length} Sections)
              </h3>
              <p className="text-xs text-[var(--muted)]">Reorder or toggle visibility of homepage blocks</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  sec.isVisible
                    ? 'bg-[var(--soft)] border-[var(--line)]'
                    : 'bg-[var(--card)] border-dashed border-[var(--line)] opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--muted)] w-5">
                    {idx + 1}.
                  </span>
                  <div>
                    <span className="font-bold text-xs text-[var(--ink)] block">{sec.name}</span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">{sec.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => moveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-[var(--line)] text-[var(--muted)] disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => moveSection(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-1.5 rounded-lg hover:bg-[var(--line)] text-[var(--muted)] disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleVisibility(sec.id)}
                    className="p-1.5 rounded-lg hover:bg-[var(--line)] text-[var(--muted)]"
                    title={sec.isVisible ? 'Hide Section' : 'Show Section'}
                  >
                    {sec.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BuilderEngine>
  );
}
