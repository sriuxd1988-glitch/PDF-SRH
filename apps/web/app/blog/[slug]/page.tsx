import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User, ShieldCheck } from 'lucide-react';
import { ButtonV6, NextSaaSBtn, Badge } from '@simplifypdf/ui';

const ARTICLES: Record<string, { title: string; category: string; date: string; readTime: string; author: string; content: string[] }> = {
  'how-to-compress-pdf-without-losing-quality': {
    title: 'How to Compress Large PDFs by 80% Without Losing Image Quality',
    category: 'PDF Guides',
    date: 'Nov 18, 2026',
    readTime: '4 min read',
    author: 'Elena Vance',
    content: [
      'PDF documents often balloon in file size due to high-resolution uncompressed raster images, redundant embedded fonts, and unreferenced object streams.',
      'Unlike legacy compressors that blindly crush image resolution down to muddy artifacts, modern permissive processing uses a multi-tier approach:',
      '1. Object Stream Linearization: Compacts cross-reference tables and compresses internal streams using qpdf and pikepdf.',
      '2. Adaptive 150 DPI Downsampling: High-res print images (300+ DPI) are downsampled to 150 DPI, which is visually indistinguishable on 4K screens while slashing megabytes.',
      '3. Color Channel Optimization: Converts heavy RGBA transparency masks into clean compressed JPEG streams.',
    ],
  },
  'why-permissive-open-source-pdf-matters': {
    title: 'Why Permissive Open-Source Engines Beat AGPL Competitors',
    category: 'Security & Privacy',
    date: 'Nov 14, 2026',
    readTime: '6 min read',
    author: 'Devon Patel',
    content: [
      'Many legacy PDF platforms were built years ago around GPL and AGPL v3 libraries like Ghostscript or PyMuPDF (fitz).',
      'For enterprise applications and commercial platforms, AGPL v3 poses severe compliance risks, as any network interaction can trigger requirements to open-source private backend code.',
      'SimplifyPDF was built from scratch exclusively on Apache 2.0, BSD, MIT, and MPL 2.0 licenses (pypdfium2, pikepdf, qpdf, pdf2docx), guaranteeing 100% legal compliance and commercial safety.',
    ],
  },
  'complete-guide-to-pdf-redaction': {
    title: 'True Redaction vs Black Highlighting: Protecting Sensitive Data',
    category: 'Productivity',
    date: 'Nov 10, 2026',
    readTime: '5 min read',
    author: 'Elena Vance',
    content: [
      'A dangerous mistake many users make is drawing black rectangles over sensitive text in standard PDF viewers.',
      'Drawing an annotation does NOT delete the underlying characters. Anyone can simply copy the text beneath the black box or inspect the raw stream.',
      'True redaction requires deep content stream sanitization: removing the actual font glyph instructions, deleting the bytes from the content dictionary, and purging document metadata.',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const article = ARTICLES[resolved.slug];
  if (!article) return { title: 'Article Not Found — SimplifyPDF' };

  return {
    title: `${article.title} — SimplifyPDF Blog`,
    description: article.content[0],
    openGraph: {
      title: article.title,
      description: article.content[0],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const article = ARTICLES[resolved.slug];
  if (!article) notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-8">
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="pro">{article.category.toUpperCase()}</Badge>
          <span className="text-xs text-[var(--muted)]">•</span>
          <span className="text-xs font-medium text-[var(--muted)]">{article.readTime}</span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-5xl text-[var(--ink)] tracking-tight leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-xs font-medium text-[var(--muted)] mt-4 pt-4 border-t border-[var(--line)]">
          <span>By {article.author}</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none flex flex-col gap-6 text-base text-[var(--text)] leading-relaxed">
        {article.content.map((p, i) => (
          <p key={i} className="text-base sm:text-lg text-[var(--text)] font-normal leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      {/* Relevant Tool CTA */}
      <div className="mt-8 p-8 rounded-3xl bg-[var(--primary-50)] dark:bg-[var(--card)] border border-[var(--primary-500)]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h3 className="font-heading font-semibold text-xl text-[var(--ink)] tracking-tight">
            Ready to process your documents?
          </h3>
          <p className="text-xs text-[var(--muted)] font-normal mt-1">
            Try SimplifyPDF tools for free. Zero telemetry, high speed, automated shredding.
          </p>
        </div>
        <Link href="/tools/compress">
          <ButtonV6 text="Try Compress Free" hoverText="Up to 85% reduction" variant="primary" size="md" />
        </Link>
      </div>
    </article>
  );
}
