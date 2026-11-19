'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DropZone } from '../../../components/DropZone';
import { ShieldCheck, Zap, Lock, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@simplifypdf/ui';

const TOOL_META: Record<string, { title: string; toolType: string; desc: string; maxMb: number; tips: string[] }> = {
  compress: {
    title: 'Compress PDF',
    toolType: 'COMPRESS',
    desc: 'Reduce PDF file sizes dramatically while keeping crisp vector fonts and sharp images.',
    maxMb: 50,
    tips: ['Linearizes file for fast web streaming', 'Downsamples heavy raster images to 150 DPI', 'Removes unreferenced object streams'],
  },
  merge: {
    title: 'Merge PDF',
    toolType: 'MERGE',
    desc: 'Combine multiple PDF documents into a single document in any custom order.',
    maxMb: 50,
    tips: ['Maintains bookmarks and outlines', 'Drag to reorder pages before merging', 'Preserves original document color profiles'],
  },
  split: {
    title: 'Split PDF',
    toolType: 'SPLIT',
    desc: 'Extract individual pages or extract custom page ranges into clean separate documents.',
    maxMb: 50,
    tips: ['Extract specific page numbers (e.g. 1-5, 8)', 'Download all pages as a convenient ZIP archive', 'Preserves embedded hyperlinks and annotations'],
  },
  'word-to-pdf': {
    title: 'Word to PDF',
    toolType: 'WORD_TO_PDF',
    desc: 'Convert DOC and DOCX Word documents into standard high-fidelity PDF files.',
    maxMb: 50,
    tips: ['Headless LibreOffice conversion', 'Zero font substitution artifacts', 'Instant page layout preservation'],
  },
  'pdf-to-word': {
    title: 'PDF to Word',
    toolType: 'PDF_TO_WORD',
    desc: 'Convert PDF files into fully editable Microsoft Word (.docx) documents.',
    maxMb: 50,
    tips: ['Retains editable tables and paragraphs', 'Extracts embedded images cleanly', 'High accuracy paragraph reflow'],
  },
  'pdf-to-images': {
    title: 'PDF to JPG',
    toolType: 'PDF_TO_IMAGES',
    desc: 'Convert PDF pages into high-resolution JPG or PNG image files.',
    maxMb: 50,
    tips: ['Powered by pypdfium2 BSD engine', 'Customizable 150/300 DPI rendering', 'Packaged as a direct ZIP download'],
  },
  'images-to-pdf': {
    title: 'JPG to PDF',
    toolType: 'IMAGES_TO_PDF',
    desc: 'Turn JPG, PNG, and WebP images into a standardized single PDF file.',
    maxMb: 50,
    tips: ['Auto-rotates images according to EXIF data', 'Fits to standard A4 / US Letter pages', 'Zero compression loss option'],
  },
  protect: {
    title: 'Protect PDF',
    toolType: 'PROTECT',
    desc: 'Encrypt your PDF with unbreakable 256-bit AES passwords and restrict unauthorized editing.',
    maxMb: 50,
    tips: ['Standard Acrobat X 256-bit AES encryption', 'Restrict printing and copying', 'Zero plaintext password storage'],
  },
  unlock: {
    title: 'Unlock PDF',
    toolType: 'UNLOCK',
    desc: 'Remove passwords and encryption restrictions from PDF files you own.',
    maxMb: 50,
    tips: ['Instantly removes owner restrictions', 'Requires valid user password if document is locked', 'Outputs clean unprotected PDF'],
  },
};

export default function ToolPage() {
  const params = useParams();
  const slug = String(params?.slug || 'compress');
  const tool = TOOL_META[slug] || {
    title: `${slug.replace('-', ' ').toUpperCase()}`,
    toolType: slug.toUpperCase().replace('-', '_'),
    desc: `Process your documents with SimplifyPDF's permissive open-source engine.`,
    maxMb: 50,
    tips: ['Fast direct-to-S3 upload', 'Automated 2-hour file shredding', '100% permissive engine'],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-12">
      <div className="flex items-center gap-2">
        <Link
          href="/#tools"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all tools
        </Link>
      </div>

      <div className="text-center flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-500)] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> High-Speed Permissive Processing
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-[var(--ink)] tracking-tight">
          {tool.title}
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl">
          {tool.desc}
        </p>
      </div>

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
