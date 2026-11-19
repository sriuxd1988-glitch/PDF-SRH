'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Minimize2,
  Combine,
  Scissors,
  FileCode,
  Image as ImageIcon,
  Lock,
  Unlock,
  ScanText,
  FilePenLine,
  Zap,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ButtonV6, NextSaaSBtn, GlowCard, Badge } from '@simplifypdf/ui';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'OPTIMIZE' | 'CONVERT' | 'SECURITY' | 'EDIT'>('ALL');

  const tools = [
    { slug: 'compress', name: 'Compress PDF', desc: 'Reduce file size by up to 85% while preserving crisp quality.', cat: 'OPTIMIZE', icon: Minimize2, badge: 'Popular' },
    { slug: 'merge', name: 'Merge PDF', desc: 'Combine multiple PDFs into one unified document in any custom order.', cat: 'OPTIMIZE', icon: Combine, badge: null },
    { slug: 'split', name: 'Split PDF', desc: 'Separate one or multiple pages into clean independent PDF files.', cat: 'OPTIMIZE', icon: Scissors, badge: null },
    { slug: 'word-to-pdf', name: 'Word to PDF', desc: 'Convert DOCX files into standard PDFs with 1:1 layout fidelity.', cat: 'CONVERT', icon: FileText, badge: null },
    { slug: 'pdf-to-word', name: 'PDF to Word', desc: 'Turn PDF documents into editable Word documents instantly.', cat: 'CONVERT', icon: FileCode, badge: null },
    { slug: 'pdf-to-images', name: 'PDF to JPG', desc: 'Extract every PDF page as high-resolution JPG or PNG images.', cat: 'CONVERT', icon: ImageIcon, badge: null },
    { slug: 'images-to-pdf', name: 'JPG to PDF', desc: 'Compile multiple images into a clean single PDF file.', cat: 'CONVERT', icon: ImageIcon, badge: null },
    { slug: 'protect', name: 'Protect PDF', desc: 'Lock documents with unbreakable 256-bit AES encryption passwords.', cat: 'SECURITY', icon: Lock, badge: 'Secure' },
    { slug: 'unlock', name: 'Unlock PDF', desc: 'Remove passwords and permissions from encrypted PDF documents.', cat: 'SECURITY', icon: Unlock, badge: null },
    { slug: 'ocr', name: 'OCR PDF', desc: 'Extract searchable and copyable text from scanned paper documents.', cat: 'CONVERT', icon: ScanText, badge: 'PRO' },
    { slug: 'esign', name: 'eSign PDF', desc: 'Draw or type legally binding electronic signatures on documents.', cat: 'SECURITY', icon: FilePenLine, badge: 'New' },
  ];

  const filteredTools = activeCategory === 'ALL' ? tools : tools.filter((t) => t.cat === activeCategory);

  return (
    <div className="flex flex-col gap-24 py-12">
      {/* 1. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-[var(--card)] shadow-sm">
          <Badge variant="pro">SIMPLIFYPDF 2.0</Badge>
          <span className="text-xs font-semibold text-[var(--muted)]">Zero telemetry • 100% Permissive Engines</span>
        </div>

        <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[var(--ink)] max-w-4xl leading-[1.08]">
          Every PDF tool you will ever need, <span className="text-[var(--primary-500)]">simplified</span>.
        </h1>

        <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl leading-relaxed">
          High-performance PDF compression, merging, conversion, and signing. Direct-to-storage processing with 2-hour auto-shredding.
        </p>

        {/* 2. UNIVERSAL DROP ZONE */}
        <div className="w-full mt-4">
          <DropZone toolType="COMPRESS" toolTitle="Drop PDF to Compress" maxFileSizeMb={50} />
        </div>
      </section>

      {/* 3. TRUST BANNER */}
      <section className="w-full border-y border-[var(--line)] py-10 bg-[var(--soft)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--muted)]">
            Trusted by 500,000+ developers, legal teams & businesses worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-60 font-heading font-black text-xl tracking-tight text-[var(--ink)]">
            <span>GOOGLE</span>
            <span>STRIPE</span>
            <span>VERCEL</span>
            <span>META</span>
            <span>AMAZON</span>
            <span>MICROSOFT</span>
          </div>
        </div>
      </section>

      {/* 4. TOOLS GRID */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">
              All PDF Tools
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted)] mt-1">
              Engineered with permissive open-source libraries (pypdfium2, pikepdf, qpdf).
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] overflow-x-auto max-w-full">
            {(['ALL', 'OPTIMIZE', 'CONVERT', 'SECURITY', 'EDIT'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                <GlowCard className="p-6 h-full flex flex-col justify-between group-hover:border-[var(--primary-500)] transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      {tool.badge && (
                        <Badge variant={tool.badge === 'PRO' ? 'pro' : 'outline'}>
                          {tool.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-heading font-black text-xl text-[var(--ink)] group-hover:text-[var(--primary-500)] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-[var(--muted)] mt-2 line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs font-bold text-[var(--primary-500)] group-hover:translate-x-1 transition-transform">
                    <span>Use tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </GlowCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. STATS RAIL */}
      <section className="w-full bg-[var(--secondary)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-heading font-black text-4xl sm:text-5xl text-[var(--lime)]">14.8M+</div>
            <div className="text-xs sm:text-sm text-white/70 font-semibold mt-2">Files Processed</div>
          </div>
          <div>
            <div className="font-heading font-black text-4xl sm:text-5xl text-[var(--cyan)]">99.98%</div>
            <div className="text-xs sm:text-sm text-white/70 font-semibold mt-2">Service Uptime SLA</div>
          </div>
          <div>
            <div className="font-heading font-black text-4xl sm:text-5xl text-[var(--yellow)]">1.2s</div>
            <div className="text-xs sm:text-sm text-white/70 font-semibold mt-2">Average Processing Speed</div>
          </div>
          <div>
            <div className="font-heading font-black text-4xl sm:text-5xl text-white">0</div>
            <div className="text-xs sm:text-sm text-white/70 font-semibold mt-2">Data Retained Beyond 24h</div>
          </div>
        </div>
      </section>

      {/* 6. PERMISSIVE VS AGPL COMPARISON */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        <h2 className="font-heading font-black text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mb-4">
          Built for Compliance: 100% Permissive Open-Source
        </h2>
        <p className="text-base text-[var(--muted)] max-w-2xl mx-auto mb-10">
          Unlike legacy platforms that rely on viral AGPL v3 libraries (PyMuPDF or Ghostscript), SimplifyPDF is engineered from the ground up using commercially safe licenses.
        </p>

        <div className="border border-[var(--line)] rounded-3xl overflow-hidden bg-[var(--card)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--soft)] border-b border-[var(--line)] text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              <tr>
                <th className="p-4">Engine Component</th>
                <th className="p-4">SimplifyPDF</th>
                <th className="p-4">License</th>
                <th className="p-4">Legacy Competitors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              <tr>
                <td className="p-4 font-semibold text-[var(--ink)]">PDF Rasterizer & Renderer</td>
                <td className="p-4 text-emerald-600 font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> pypdfium2</td>
                <td className="p-4 font-mono text-xs text-[var(--muted)]">Apache 2.0 / BSD</td>
                <td className="p-4 text-rose-500 font-mono text-xs">PyMuPDF / fitz (AGPL v3)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[var(--ink)]">PDF Compression & Streams</td>
                <td className="p-4 text-emerald-600 font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> pikepdf + qpdf</td>
                <td className="p-4 font-mono text-xs text-[var(--muted)]">MPL 2.0 / Apache 2.0</td>
                <td className="p-4 text-rose-500 font-mono text-xs">Ghostscript (AGPL v3)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[var(--ink)]">Storage & Upload Path</td>
                <td className="p-4 text-emerald-600 font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Direct MinIO S3 Presigned</td>
                <td className="p-4 font-mono text-xs text-[var(--muted)]">Zero VPS Proxy Load</td>
                <td className="p-4 text-amber-500 font-mono text-xs">Node.js Memory Proxy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. HIGH IMPACT FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full text-center">
        <div className="rounded-3xl bg-[var(--primary-500)] text-white p-10 sm:p-16 flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <h2 className="font-heading font-black text-3xl sm:text-5xl tracking-tight max-w-2xl text-white">
            Ready to experience the fastest, most reliable PDF platform?
          </h2>
          <p className="text-white/80 max-w-xl text-base sm:text-lg">
            No credit card required. Free tier gives you 10 tasks daily with 50MB files. Upgrade anytime for 2GB multi-file processing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link href="/pricing">
              <ButtonV6 text="Upgrade to PRO" hoverText="2GB Batch Processing" variant="secondary" size="lg" />
            </Link>
            <Link href="/tools/compress">
              <NextSaaSBtn text="Try Compress Free" variant="primary" size="lg" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
