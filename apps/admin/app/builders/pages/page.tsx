'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Globe,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { BuilderEngine } from '../../../components/builder/BuilderEngine';

interface CustomPage {
  id: string;
  slug: string;
  title: string;
  metaDesc: string;
  inHeader: boolean;
  inFooter: boolean;
  content: string;
}

export default function CustomPagesBuilderPage() {
  const [pages, setPages] = useState<CustomPage[]>([
    {
      id: 'p-1',
      slug: 'security',
      title: 'Trust & Security Architecture',
      metaDesc: 'Details of zero-retention auto-shredding, 256-bit AES encryption, and AGPL-free permissive open-source stack.',
      inHeader: true,
      inFooter: true,
      content: '# Trust & Security Architecture\n\nSimplifyPDF guarantees zero retention...',
    },
    {
      id: 'p-2',
      slug: 'about',
      title: 'About SimplifyPDF',
      metaDesc: 'Our mission to bring permissive, fast, open-source PDF manipulation to everyone.',
      inHeader: false,
      inFooter: true,
      content: '# About SimplifyPDF\n\nBuilt for professionals requiring speed and compliance...',
    },
    {
      id: 'p-3',
      slug: 'terms',
      title: 'Terms of Service',
      metaDesc: 'Official terms and conditions governing the use of SimplifyPDF tools and subscriptions.',
      inHeader: false,
      inFooter: true,
      content: '# Terms of Service\n\nLast updated: November 2025...',
    },
    {
      id: 'p-4',
      slug: 'privacy',
      title: 'Privacy Policy & DPDP',
      metaDesc: 'How SimplifyPDF complies with India DPDP Act and GDPR Article 17.',
      inHeader: false,
      inFooter: true,
      content: '# Privacy Policy\n\nWe do not store your documents longer than necessary...',
    },
  ]);

  const [selectedPage, setSelectedPage] = useState<CustomPage>(pages[0]);

  const handleUpdate = (field: keyof CustomPage, val: any) => {
    const updated = { ...selectedPage, [field]: val };
    setSelectedPage(updated);
    setPages(pages.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddNewPage = () => {
    const newPage: CustomPage = {
      id: `p-${Date.now()}`,
      slug: 'new-page',
      title: 'New Custom Page',
      metaDesc: 'Meta description for search engines.',
      inHeader: false,
      inFooter: false,
      content: '# New Page Title\n\nStart writing page content here...',
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPage);
  };

  const handlePublish = () => {
    console.log(`Publishing custom page /${selectedPage.slug} to database and cache:config:page:${selectedPage.slug}`);
  };

  return (
    <BuilderEngine
      title="Custom Pages &amp; Legal Builder"
      subtitle="Visual authoring studio for About, Security, Contact, and Legal pages with instant SEO schemas."
      previewUrl={`http://localhost:3000/${selectedPage.slug}`}
      onPublish={handlePublish}
    >
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        {/* Page Selector Rail */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex flex-wrap gap-2">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPage(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPage.id === p.id
                    ? 'bg-[var(--primary-500)] text-white shadow-sm'
                    : 'bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
                }`}
              >
                /{p.slug}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddNewPage}
            className="px-3 py-1.5 rounded-xl bg-[var(--secondary)] text-white font-bold text-xs hover:bg-black inline-flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>New Page</span>
          </button>
        </div>

        {/* Page Meta Settings */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Page URL Slug
              </label>
              <div className="flex items-center rounded-xl bg-[var(--soft)] border border-[var(--line)] px-2.5">
                <span className="text-xs text-[var(--muted)] font-mono">/</span>
                <input
                  type="text"
                  value={selectedPage.slug}
                  onChange={(e) => handleUpdate('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full py-2 px-1 bg-transparent text-xs font-mono font-bold text-[var(--ink)] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Browser Title Tag
              </label>
              <input
                type="text"
                value={selectedPage.title}
                onChange={(e) => handleUpdate('title', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
              Meta Description (Search Snippet)
            </label>
            <textarea
              rows={2}
              value={selectedPage.metaDesc}
              onChange={(e) => handleUpdate('metaDesc', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)]"
            />
          </div>
        </div>

        {/* Navigation Placement */}
        <div className="pt-2 border-t border-[var(--line)] flex items-center gap-6 text-xs font-bold">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPage.inHeader}
              onChange={(e) => handleUpdate('inHeader', e.target.checked)}
              className="accent-[var(--primary-500)]"
            />
            <span>Include in Header Menu</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPage.inFooter}
              onChange={(e) => handleUpdate('inFooter', e.target.checked)}
              className="accent-[var(--primary-500)]"
            />
            <span>Include in Footer Links</span>
          </label>
        </div>

        {/* Content Markdown Editor */}
        <div className="pt-2 border-t border-[var(--line)]">
          <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
            Markdown Content Body
          </label>
          <textarea
            rows={10}
            value={selectedPage.content}
            onChange={(e) => handleUpdate('content', e.target.value)}
            className="w-full p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)] font-mono text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)]"
          />
        </div>
      </div>
    </BuilderEngine>
  );
}
