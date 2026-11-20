'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Camera,
  Compass,
  BookOpen,
  Laptop,
  LayoutTemplate,
  Activity,
  PenTool,
  FileCode,
  FileCheck,
  Combine,
  Scissors,
  Lock,
  Unlock,
  EyeOff,
  FilePenLine,
  FileCog,
  Minimize2,
  Trash2,
  RotateCw,
  Layers,
  Wrench,
  Printer,
  ScanText,
  FolderTree,
  Search,
  Columns,
  Grid,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ButtonV6, NextSaaSBtn, GlowCard, Badge } from '@simplifypdf/ui';

type CategoryKey = 'ALL' | 'CONVERT_TO' | 'CONVERT_FROM' | 'MERGE_SPLIT' | 'SECURITY' | 'TOOLS';

interface ToolItem {
  slug: string;
  name: string;
  desc: string;
  cat: 'CONVERT_TO' | 'CONVERT_FROM' | 'MERGE_SPLIT' | 'SECURITY' | 'TOOLS';
  catLabel: string;
  badge?: string | null;
  accentClass: string;
  iconBgClass: string;
  iconTextClass: string;
  badgeLetter?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ALL_TOOLS: ToolItem[] = [
  // --- COLUMN 1: CONVERT TO PDF (13 tools) ---
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    desc: 'Convert DOC and DOCX Word documents into standard high-fidelity PDF files.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'blue',
    iconBgClass: 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900',
    iconTextClass: 'text-blue-600 dark:text-blue-400',
    badgeLetter: 'W',
    icon: FileText,
    badge: 'Popular',
  },
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    desc: 'Convert XLS and XLSX spreadsheets to standardized, printable PDF pages.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'emerald',
    iconBgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900',
    iconTextClass: 'text-emerald-600 dark:text-emerald-400',
    badgeLetter: 'X',
    icon: FileSpreadsheet,
    badge: null,
  },
  {
    slug: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    desc: 'Convert PPT and PPTX presentation slides into clean vector PDF documents.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'amber',
    iconBgClass: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900',
    iconTextClass: 'text-amber-600 dark:text-amber-400',
    badgeLetter: 'P',
    icon: Presentation,
    badge: null,
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    desc: 'Compile one or multiple JPG photos into a single unified PDF document.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'purple',
    iconBgClass: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900',
    iconTextClass: 'text-purple-600 dark:text-purple-400',
    icon: ImageIcon,
    badge: null,
  },
  {
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    desc: 'Convert PNG graphics and screenshots with transparent alpha channel preservation.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'purple',
    iconBgClass: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900',
    iconTextClass: 'text-purple-600 dark:text-purple-400',
    icon: ImageIcon,
    badge: null,
  },
  {
    slug: 'heic-to-pdf',
    name: 'HEIC to PDF',
    desc: 'Convert Apple iPhone HEIC and HEIF photos into universal PDF documents.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'purple',
    iconBgClass: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900',
    iconTextClass: 'text-purple-600 dark:text-purple-400',
    icon: Camera,
    badge: 'iOS',
  },
  {
    slug: 'autocad-to-pdf',
    name: 'AutoCAD to PDF',
    desc: 'Convert architectural DWG and DXF engineering drawings into vector PDF blueprints.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'rose',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    badgeLetter: 'A',
    icon: Compass,
    badge: 'CAD',
  },
  {
    slug: 'openoffice-to-pdf',
    name: 'OpenOffice to PDF',
    desc: 'Convert OpenDocument formats (.odt, .ods, .odp) into standardized PDF files.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'sky',
    iconBgClass: 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900',
    iconTextClass: 'text-sky-600 dark:text-sky-400',
    icon: FileText,
    badge: null,
  },
  {
    slug: 'ebooks-to-pdf',
    name: 'eBooks to PDF',
    desc: 'Convert EPUB, MOBI, and Kindle eBook files into readable, printable PDF documents.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'amber',
    iconBgClass: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900',
    iconTextClass: 'text-amber-600 dark:text-amber-400',
    icon: BookOpen,
    badge: null,
  },
  {
    slug: 'iwork-to-pdf',
    name: 'iWork to PDF',
    desc: 'Convert Apple Pages, Numbers, and Keynote documents into standard PDF files.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'slate',
    iconBgClass: 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700',
    iconTextClass: 'text-slate-700 dark:text-slate-300',
    icon: Laptop,
    badge: 'Mac',
  },
  {
    slug: 'publisher-to-pdf',
    name: 'Publisher to PDF',
    desc: 'Convert Microsoft Publisher (.pub) marketing layouts and brochures into PDF files.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'teal',
    iconBgClass: 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900',
    iconTextClass: 'text-teal-600 dark:text-teal-400',
    badgeLetter: 'P',
    icon: LayoutTemplate,
    badge: null,
  },
  {
    slug: 'dicom-to-pdf',
    name: 'DICOM to PDF',
    desc: 'Convert medical DICOM (.dcm) radiological imaging scans (X-ray, MRI) into clinical reports.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'cyan',
    iconBgClass: 'bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900',
    iconTextClass: 'text-cyan-600 dark:text-cyan-400',
    badgeLetter: 'D',
    icon: Activity,
    badge: 'Medical',
  },
  {
    slug: 'eps-to-pdf',
    name: 'EPS to PDF',
    desc: 'Convert vector Encapsulated PostScript (.eps) illustrations and logos to PDF format.',
    cat: 'CONVERT_TO',
    catLabel: 'Convert to PDF',
    accentClass: 'indigo',
    iconBgClass: 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900',
    iconTextClass: 'text-indigo-600 dark:text-indigo-400',
    badgeLetter: 'E',
    icon: PenTool,
    badge: null,
  },

  // --- COLUMN 2: CONVERT FROM PDF (7 tools) ---
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    desc: 'Convert PDF files into fully editable Microsoft Word (.docx) documents.',
    cat: 'CONVERT_FROM',
    catLabel: 'Convert from PDF',
    accentClass: 'blue',
    iconBgClass: 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900',
    iconTextClass: 'text-blue-600 dark:text-blue-400',
    badgeLetter: 'W',
    icon: FileCode,
    badge: 'Popular',
  },
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    desc: 'Extract financial tables, ledgers, and data from PDF into editable Excel (.xlsx) spreadsheets.',
    cat: 'CONVERT_FROM',
    catLabel: 'Convert from PDF',
    accentClass: 'emerald',
    iconBgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900',
    iconTextClass: 'text-emerald-600 dark:text-emerald-400',
    badgeLetter: 'X',
    icon: FileSpreadsheet,
    badge: null,
  },
  {
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    desc: 'Convert presentation PDF slides into fully editable PowerPoint (.pptx) slide decks.',
    cat: 'CONVERT_FROM',
    catLabel: 'Convert from PDF',
    accentClass: 'amber',
    iconBgClass: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900',
    iconTextClass: 'text-amber-600 dark:text-amber-400',
    badgeLetter: 'P',
    icon: Presentation,
    badge: null,
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    desc: 'Extract and rasterize PDF pages into high-resolution JPG image files.',
    cat: 'CONVERT_FROM',
    catLabel: 'Convert from PDF',
    accentClass: 'purple',
    iconBgClass: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900',
    iconTextClass: 'text-purple-600 dark:text-purple-400',
    icon: ImageIcon,
    badge: null,
  },
  {
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    desc: 'Export PDF pages as crisp, transparent PNG images with maximum sharpness.',
    cat: 'CONVERT_FROM',
    catLabel: 'Convert from PDF',
    accentClass: 'purple',
    iconBgClass: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900',
    iconTextClass: 'text-purple-600 dark:text-purple-400',
    icon: ImageIcon,
    badge: null,
  },
  {
    slug: 'extract-pdf-images',
    name: 'Extract PDF Images',
    desc: 'Unpack and extract all raw image assets embedded inside a PDF document.',
    cat: 'CONVERT_FROM',
    catLabel: 'Convert from PDF',
    accentClass: 'purple',
    iconBgClass: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900',
    iconTextClass: 'text-purple-600 dark:text-purple-400',
    icon: Layers,
    badge: null,
  },
  {
    slug: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    desc: 'Convert PDF documents to ISO-19005 compliant PDF/A for legal long-term archiving.',
    cat: 'CONVERT_FROM',
    catLabel: 'Convert from PDF',
    accentClass: 'blue',
    iconBgClass: 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900',
    iconTextClass: 'text-blue-600 dark:text-blue-400',
    badgeLetter: 'A',
    icon: FileCheck,
    badge: 'ISO',
  },

  // --- COLUMN 3: MERGE AND SPLIT (2 tools) ---
  {
    slug: 'merge',
    name: 'Merge PDF',
    desc: 'Combine multiple PDFs into one unified document in any custom order.',
    cat: 'MERGE_SPLIT',
    catLabel: 'Merge and Split',
    accentClass: 'orange',
    iconBgClass: 'bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900',
    iconTextClass: 'text-orange-600 dark:text-orange-400',
    icon: Combine,
    badge: 'Popular',
  },
  {
    slug: 'split',
    name: 'Split PDF',
    desc: 'Separate one or multiple pages into clean independent PDF files.',
    cat: 'MERGE_SPLIT',
    catLabel: 'Merge and Split',
    accentClass: 'orange',
    iconBgClass: 'bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900',
    iconTextClass: 'text-orange-600 dark:text-orange-400',
    icon: Scissors,
    badge: null,
  },

  // --- COLUMN 4: PDF SECURITY (4 tools) ---
  {
    slug: 'protect',
    name: 'Protect PDF',
    desc: 'Lock documents with unbreakable 256-bit AES encryption passwords.',
    cat: 'SECURITY',
    catLabel: 'PDF Security',
    accentClass: 'teal',
    iconBgClass: 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900',
    iconTextClass: 'text-teal-600 dark:text-teal-400',
    icon: Lock,
    badge: 'AES-256',
  },
  {
    slug: 'unlock',
    name: 'Unlock PDF',
    desc: 'Remove passwords and permissions from encrypted PDF documents.',
    cat: 'SECURITY',
    catLabel: 'PDF Security',
    accentClass: 'teal',
    iconBgClass: 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900',
    iconTextClass: 'text-teal-600 dark:text-teal-400',
    icon: Unlock,
    badge: null,
  },
  {
    slug: 'redact',
    name: 'Redact PDF',
    desc: 'Permanently remove sensitive text, numbers, and private regions from documents.',
    cat: 'SECURITY',
    catLabel: 'PDF Security',
    accentClass: 'teal',
    iconBgClass: 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900',
    iconTextClass: 'text-teal-600 dark:text-teal-400',
    icon: EyeOff,
    badge: 'Legal',
  },
  {
    slug: 'esign',
    name: 'eSign PDF',
    desc: 'Draw or type legally binding electronic signatures with audit certificate stamps.',
    cat: 'SECURITY',
    catLabel: 'PDF Security',
    accentClass: 'teal',
    iconBgClass: 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900',
    iconTextClass: 'text-teal-600 dark:text-teal-400',
    icon: FilePenLine,
    badge: 'PRO',
  },

  // --- COLUMN 5: PDF TOOLS (9 tools) ---
  {
    slug: 'pdf-converter',
    name: 'PDF Converter',
    desc: 'Universal smart converter: drop any document, spreadsheet, image, or presentation.',
    cat: 'TOOLS',
    catLabel: 'PDF Tools',
    accentClass: 'red',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    icon: FileCog,
    badge: 'Universal',
  },
  {
    slug: 'compress',
    name: 'Compress PDF',
    desc: 'Reduce file size by up to 85% while preserving crisp quality and vector text.',
    cat: 'TOOLS',
    catLabel: 'PDF Tools',
    accentClass: 'red',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    icon: Minimize2,
    badge: 'Popular',
  },
  {
    slug: 'delete-pages',
    name: 'Delete PDF Pages',
    desc: 'Remove unwanted, blank, or sensitive pages permanently from any PDF document.',
    cat: 'TOOLS',
    catLabel: 'PDF Tools',
    accentClass: 'red',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    icon: Trash2,
    badge: null,
  },
  {
    slug: 'rotate',
    name: 'Rotate PDF',
    desc: 'Rotate individual pages or the entire PDF document permanently.',
    cat: 'TOOLS',
    catLabel: 'PDF Tools',
    accentClass: 'red',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    icon: RotateCw,
    badge: null,
  },
  {
    slug: 'flatten',
    name: 'Flatten PDF',
    desc: 'Bake interactive fillable form fields and digital annotations into static page content.',
    cat: 'TOOLS',
    catLabel: 'PDF Tools',
    accentClass: 'red',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    icon: Layers,
    badge: null,
  },
  {
    slug: 'repair',
    name: 'Repair PDF',
    desc: 'Recover and repair damaged, corrupted, or unreadable PDF files.',
    cat: 'TOOLS',
    catLabel: 'PDF Tools',
    accentClass: 'red',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    icon: Wrench,
    badge: 'Rescue',
  },
  {
    slug: 'print-ready',
    name: 'Print-Ready PDF',
    desc: 'Prepress prep: flatten transparency, convert to CMYK, and configure trim marks.',
    cat: 'TOOLS',
    catLabel: 'PDF Tools',
    accentClass: 'red',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    icon: Printer,
    badge: 'Print',
  },
  {
    slug: 'ocr',
    name: 'OCR PDF',
    desc: 'Extract selectable, searchable text from scanned paper PDF documents.',
    cat: 'TOOLS',
    catLabel: 'PDF Tools',
    accentClass: 'red',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    icon: ScanText,
    badge: 'PRO',
  },
  {
    slug: 'organize',
    name: 'Organize PDF',
    desc: 'Rearrange, rotate, and delete pages inside your PDF documents with visual reordering.',
    cat: 'TOOLS',
    catLabel: 'PDF Tools',
    accentClass: 'red',
    iconBgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900',
    iconTextClass: 'text-rose-600 dark:text-rose-400',
    icon: FolderTree,
    badge: null,
  },
];

const CATEGORIES: { key: CategoryKey; label: string; count: number }[] = [
  { key: 'ALL', label: 'All Tools', count: ALL_TOOLS.length },
  { key: 'CONVERT_TO', label: 'Convert to PDF', count: ALL_TOOLS.filter((t) => t.cat === 'CONVERT_TO').length },
  { key: 'CONVERT_FROM', label: 'Convert from PDF', count: ALL_TOOLS.filter((t) => t.cat === 'CONVERT_FROM').length },
  { key: 'MERGE_SPLIT', label: 'Merge & Split', count: ALL_TOOLS.filter((t) => t.cat === 'MERGE_SPLIT').length },
  { key: 'SECURITY', label: 'PDF Security', count: ALL_TOOLS.filter((t) => t.cat === 'SECURITY').length },
  { key: 'TOOLS', label: 'PDF Tools', count: ALL_TOOLS.filter((t) => t.cat === 'TOOLS').length },
];

const DIRECTORY_COLUMNS: { cat: CategoryKey; title: string }[] = [
  { cat: 'CONVERT_TO', title: 'CONVERT TO PDF' },
  { cat: 'CONVERT_FROM', title: 'CONVERT FROM PDF' },
  { cat: 'MERGE_SPLIT', title: 'MERGE AND SPLIT' },
  { cat: 'SECURITY', title: 'PDF SECURITY' },
  { cat: 'TOOLS', title: 'PDF TOOLS' },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'DIRECTORY' | 'GRID'>('DIRECTORY');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'ALL' || tool.cat === activeCategory;
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-20 py-10 antialiased">
      {/* 1. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-[var(--card)] shadow-sm">
          <Badge variant="pro">SIMPLIFYPDF 2.0</Badge>
          <span className="text-xs font-medium text-[var(--muted)]">35 High-Speed Tools • 100% Permissive Engines</span>
        </div>

        <h1 className="font-heading font-bold text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] text-[var(--ink)] max-w-4xl leading-[1.12]">
          Every PDF tool you will ever need, <span className="text-[var(--primary-500)]">simplified</span>.
        </h1>

        <p className="text-base sm:text-lg text-[var(--muted)] font-normal max-w-2xl leading-relaxed">
          High-performance PDF conversion, compression, editing, security, and signing. Direct-to-storage processing with 2-hour auto-shredding.
        </p>

        {/* 2. UNIVERSAL DROP ZONE */}
        <div className="w-full mt-4">
          <DropZone toolType="COMPRESS" toolTitle="Drop PDF to Compress" maxFileSizeMb={50} />
        </div>
      </section>

      {/* 3. TRUST BANNER */}
      <section className="w-full border-y border-[var(--line)] py-10 bg-[var(--soft)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">
            Trusted by 500,000+ developers, legal teams & businesses worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-50 font-heading font-bold text-base sm:text-lg tracking-wider text-[var(--ink)]">
            <span>GOOGLE</span>
            <span>STRIPE</span>
            <span>VERCEL</span>
            <span>META</span>
            <span>AMAZON</span>
            <span>MICROSOFT</span>
          </div>
        </div>
      </section>

      {/* 4. TOOLS DIRECTORY & GRID SECTION */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col gap-8 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary-500)] mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Complete Suite
              </div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">
                All PDF Tools
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)] font-normal mt-1 max-w-xl">
                Choose from 35 specialized tools organized for lightning-fast conversion, compression, merging, and legal security.
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search 35 tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 text-xs rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary-500)] transition-colors"
                />
              </div>

              {/* View Toggle */}
              <div className="inline-flex items-center p-1 rounded-xl bg-[var(--soft)] border border-[var(--line)] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('DIRECTORY')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'DIRECTORY'
                      ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                  title="5-Column Directory View"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Directory</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('GRID')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'GRID'
                      ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                  title="Card Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] overflow-x-auto max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeCategory === cat.key
                    ? 'bg-[var(--card)] text-[var(--ink)] font-semibold shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  activeCategory === cat.key
                    ? 'bg-[var(--primary-50)] text-[var(--primary-500)]'
                    : 'bg-[var(--line)]/50 text-[var(--muted)]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 5-COLUMN DIRECTORY VIEW (Matching user's screenshot layout) */}
        {viewMode === 'DIRECTORY' && !searchQuery && activeCategory === 'ALL' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
            {DIRECTORY_COLUMNS.map((col) => {
              const toolsInCol = ALL_TOOLS.filter((t) => t.cat === col.cat);
              return (
                <div key={col.cat} className="flex flex-col gap-4">
                  <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-[var(--ink)] pb-3 border-b border-[var(--line)]">
                    {col.title}
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {toolsInCol.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          className="group flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--soft)] transition-all"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tool.iconBgClass} ${tool.iconTextClass} group-hover:scale-105 transition-transform relative`}
                          >
                            {tool.badgeLetter ? (
                              <div className="flex items-center justify-center">
                                <span className="font-mono font-bold text-xs">{tool.badgeLetter}</span>
                              </div>
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--primary-500)] transition-colors tracking-tight">
                            {tool.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* GRID VIEW (Rich Cards with Descriptions & Metadata) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                  <GlowCard className="p-6 h-full flex flex-col justify-between group-hover:border-[var(--primary-500)] transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${tool.iconBgClass} ${tool.iconTextClass}`}>
                          {tool.badgeLetter ? (
                            <span className="font-mono font-bold text-lg">{tool.badgeLetter}</span>
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        {tool.badge && (
                          <Badge variant={tool.badge === 'PRO' ? 'pro' : 'outline'}>
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
                        {tool.catLabel}
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-[var(--ink)] group-hover:text-[var(--primary-500)] transition-colors tracking-tight">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-[var(--muted)] font-normal mt-2 line-clamp-2 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-1 text-xs font-medium text-[var(--primary-500)] group-hover:translate-x-1 transition-transform">
                      <span>Launch tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </GlowCard>
                </Link>
              );
            })}
          </div>
        )}

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-[var(--soft)]/50 rounded-2xl border border-[var(--line)]">
            <p className="text-sm text-[var(--muted)]">No tools found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('ALL');
              }}
              className="mt-3 text-xs font-medium text-[var(--primary-500)] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* 5. STATS RAIL */}
      <section className="w-full bg-[var(--secondary)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-heading font-bold text-4xl sm:text-5xl text-[var(--lime)] tracking-tight tabular-nums">14.8M+</div>
            <div className="text-xs sm:text-sm text-white/70 font-normal mt-2">Files Processed</div>
          </div>
          <div>
            <div className="font-heading font-bold text-4xl sm:text-5xl text-[var(--cyan)] tracking-tight tabular-nums">99.98%</div>
            <div className="text-xs sm:text-sm text-white/70 font-normal mt-2">Service Uptime SLA</div>
          </div>
          <div>
            <div className="font-heading font-bold text-4xl sm:text-5xl text-[var(--yellow)] tracking-tight tabular-nums">1.2s</div>
            <div className="text-xs sm:text-sm text-white/70 font-normal mt-2">Average Processing Speed</div>
          </div>
          <div>
            <div className="font-heading font-bold text-4xl sm:text-5xl text-white tracking-tight tabular-nums">0</div>
            <div className="text-xs sm:text-sm text-white/70 font-normal mt-2">Data Retained Beyond 24h</div>
          </div>
        </div>
      </section>

      {/* 6. PERMISSIVE VS AGPL COMPARISON */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mb-4">
          Built for Compliance: 100% Permissive Open-Source
        </h2>
        <p className="text-base text-[var(--muted)] font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
          Unlike legacy platforms that rely on viral AGPL v3 libraries (PyMuPDF or Ghostscript), SimplifyPDF is engineered from the ground up using commercially safe licenses.
        </p>

        <div className="border border-[var(--line)] rounded-3xl overflow-hidden bg-[var(--card)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--soft)] border-b border-[var(--line)] text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              <tr>
                <th className="p-4">Engine Component</th>
                <th className="p-4">SimplifyPDF</th>
                <th className="p-4">License</th>
                <th className="p-4">Legacy Competitors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">PDF Rasterizer & Renderer</td>
                <td className="p-4 text-emerald-600 font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> pypdfium2</td>
                <td className="p-4 font-mono text-xs text-[var(--muted)]">Apache 2.0 / BSD</td>
                <td className="p-4 text-rose-500 font-mono text-xs">PyMuPDF / fitz (AGPL v3)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">PDF Compression & Streams</td>
                <td className="p-4 text-emerald-600 font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> pikepdf + qpdf</td>
                <td className="p-4 font-mono text-xs text-[var(--muted)]">MPL 2.0 / Apache 2.0</td>
                <td className="p-4 text-rose-500 font-mono text-xs">Ghostscript (AGPL v3)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-[var(--ink)]">Storage & Upload Path</td>
                <td className="p-4 text-emerald-600 font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Direct MinIO S3 Presigned</td>
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
          <h2 className="font-heading font-bold text-3xl sm:text-5xl tracking-tight max-w-2xl text-white">
            Ready to experience the fastest, most reliable PDF platform?
          </h2>
          <p className="text-white/85 max-w-xl text-base sm:text-lg font-normal leading-relaxed">
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
