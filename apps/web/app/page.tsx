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
  Crop,
  Stamp,
  Highlighter,
  Eye,
  Hash,
  CheckSquare,
  Share2,
  Send,
  FolderArchive,
  Type,
} from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { ButtonV6, NextSaaSBtn, GlowCard, Badge } from '@simplifypdf/ui';

type CategoryFilter = 'ALL' | 'COMPRESS_CONVERT' | 'OFFICE' | 'ORGANIZE' | 'EDIT' | 'SIGN_PROTECT';

interface ToolItem {
  slug: string;
  name: string;
  desc: string;
  group: string;
  filterCat: CategoryFilter;
  badge?: string | null;
  solidBg: string;
  badgeLetter?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DirectoryGroup {
  title: string;
  tools: ToolItem[];
}

interface DirectoryColumn {
  colIndex: number;
  groups: DirectoryGroup[];
}

const ALL_TOOLS: ToolItem[] = [
  // ==========================================
  // COLUMN 1: Compress, Convert, PDF to Image, Image to PDF
  // ==========================================
  // Compress
  {
    slug: 'compress',
    name: 'Compress PDF',
    desc: 'Reduce file size by up to 85% while preserving crisp quality and vector text.',
    group: 'Compress',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#E53935',
    icon: Minimize2,
    badge: 'Popular',
  },
  // Convert
  {
    slug: 'pdf-converter',
    name: 'PDF Converter',
    desc: 'Universal smart converter: drop any document, spreadsheet, image, or presentation.',
    group: 'Convert',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#E53935',
    icon: FileCog,
    badge: 'Universal',
  },
  {
    slug: 'ocr',
    name: 'PDF OCR',
    desc: 'Extract selectable, searchable text from scanned paper PDF documents.',
    group: 'Convert',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#E53935',
    badgeLetter: 'OCR',
    icon: ScanText,
    badge: 'PRO',
  },
  {
    slug: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    desc: 'Convert PDF documents to ISO-19005 compliant PDF/A for legal long-term archiving.',
    group: 'Convert',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#E53935',
    badgeLetter: 'PDF/A',
    icon: FileCheck,
    badge: 'ISO',
  },
  // PDF to Image
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    desc: 'Extract and rasterize PDF pages into high-resolution JPG image files.',
    group: 'PDF to Image',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#F59E0B',
    icon: ImageIcon,
    badge: null,
  },
  {
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    desc: 'Export PDF pages as crisp, transparent PNG images with maximum sharpness.',
    group: 'PDF to Image',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#F59E0B',
    badgeLetter: 'PNG',
    icon: ImageIcon,
    badge: null,
  },
  // Image to PDF
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    desc: 'Compile one or multiple JPG photos into a single unified PDF document.',
    group: 'Image to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#F59E0B',
    icon: ImageIcon,
    badge: null,
  },
  {
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    desc: 'Convert PNG graphics and screenshots with transparent alpha channel preservation.',
    group: 'Image to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#F59E0B',
    badgeLetter: 'PNG',
    icon: ImageIcon,
    badge: null,
  },
  {
    slug: 'heic-to-pdf',
    name: 'HEIC to PDF',
    desc: 'Convert Apple iPhone HEIC and HEIF photos into universal PDF documents.',
    group: 'Image to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#F59E0B',
    icon: Camera,
    badge: 'iOS',
  },

  // ==========================================
  // COLUMN 2: PDF to Office, Office to PDF, OpenOffice to PDF
  // ==========================================
  // PDF to Office
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    desc: 'Convert PDF files into fully editable Microsoft Word (.docx) documents.',
    group: 'PDF to Office',
    filterCat: 'OFFICE',
    solidBg: '#185ABD',
    badgeLetter: 'W',
    icon: FileCode,
    badge: 'Popular',
  },
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    desc: 'Extract financial tables and data from PDF into editable Excel (.xlsx) spreadsheets.',
    group: 'PDF to Office',
    filterCat: 'OFFICE',
    solidBg: '#107C41',
    badgeLetter: 'X',
    icon: FileSpreadsheet,
    badge: null,
  },
  {
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PPT',
    desc: 'Convert presentation PDF slides into fully editable PowerPoint (.pptx) slide decks.',
    group: 'PDF to Office',
    filterCat: 'OFFICE',
    solidBg: '#D83B01',
    badgeLetter: 'P',
    icon: Presentation,
    badge: null,
  },
  // Office to PDF
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    desc: 'Convert DOC and DOCX Word documents into standard high-fidelity PDF files.',
    group: 'Office to PDF',
    filterCat: 'OFFICE',
    solidBg: '#185ABD',
    badgeLetter: 'W',
    icon: FileText,
    badge: 'Popular',
  },
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    desc: 'Convert XLS and XLSX spreadsheets to standardized, printable PDF pages.',
    group: 'Office to PDF',
    filterCat: 'OFFICE',
    solidBg: '#107C41',
    badgeLetter: 'X',
    icon: FileSpreadsheet,
    badge: null,
  },
  {
    slug: 'powerpoint-to-pdf',
    name: 'PPT to PDF',
    desc: 'Convert PPT and PPTX presentation slides into clean vector PDF documents.',
    group: 'Office to PDF',
    filterCat: 'OFFICE',
    solidBg: '#D83B01',
    badgeLetter: 'P',
    icon: Presentation,
    badge: null,
  },
  // OpenOffice to PDF
  {
    slug: 'odt-to-pdf',
    name: 'ODT to PDF',
    desc: 'Convert OpenDocument Text (.odt) documents into standardized PDF files.',
    group: 'OpenOffice to PDF',
    filterCat: 'OFFICE',
    solidBg: '#0288D1',
    badgeLetter: 'ODT',
    icon: FileText,
    badge: null,
  },
  {
    slug: 'ods-to-pdf',
    name: 'ODS to PDF',
    desc: 'Convert OpenDocument Spreadsheet (.ods) files to standardized, printable PDF pages.',
    group: 'OpenOffice to PDF',
    filterCat: 'OFFICE',
    solidBg: '#107C41',
    badgeLetter: 'ODS',
    icon: FileSpreadsheet,
    badge: null,
  },
  {
    slug: 'odp-to-pdf',
    name: 'ODP to PDF',
    desc: 'Convert OpenDocument Presentation (.odp) slide decks into clean PDF documents.',
    group: 'OpenOffice to PDF',
    filterCat: 'OFFICE',
    solidBg: '#D83B01',
    badgeLetter: 'ODP',
    icon: Presentation,
    badge: null,
  },

  // ==========================================
  // COLUMN 3: Convert to PDF, iWork to PDF
  // ==========================================
  // Convert to PDF
  {
    slug: 'txt-to-pdf',
    name: 'TXT to PDF',
    desc: 'Convert plain text files into cleanly formatted, printable PDF documents.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#1E88E5',
    badgeLetter: 'TXT',
    icon: FileText,
    badge: null,
  },
  {
    slug: 'rtf-to-pdf',
    name: 'RTF to PDF',
    desc: 'Convert Rich Text Format (.rtf) documents to PDF with styled text preservation.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#1E88E5',
    badgeLetter: 'RTF',
    icon: FileText,
    badge: null,
  },
  {
    slug: 'hwp-to-pdf',
    name: 'HWP to PDF',
    desc: 'Convert Hancom Hangul Word Processor (.hwp, .hwpx) documents into standard PDF.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#1E88E5',
    badgeLetter: 'HWP',
    icon: FileText,
    badge: 'Hangul',
  },
  {
    slug: 'html-to-pdf',
    name: 'HTML to PDF',
    desc: 'Convert HTML web pages and code files into high-fidelity vector PDF documents.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#1E88E5',
    badgeLetter: 'HTML',
    icon: FileCode,
    badge: null,
  },
  {
    slug: 'epub-to-pdf',
    name: 'EPUB to PDF',
    desc: 'Convert EPUB eBook files into printable and shareable PDF documents.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#1E88E5',
    badgeLetter: 'EPUB',
    icon: BookOpen,
    badge: null,
  },
  {
    slug: 'zip-to-pdf',
    name: 'ZIP to PDF',
    desc: 'Unpack files inside a ZIP archive and compile them into a unified PDF document.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#1E88E5',
    badgeLetter: 'ZIP',
    icon: FolderArchive,
    badge: null,
  },
  {
    slug: 'csv-to-pdf',
    name: 'CSV to PDF',
    desc: 'Convert raw CSV spreadsheets into clean, paginated tabular PDF reports.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#107C41',
    badgeLetter: 'CSV',
    icon: FileSpreadsheet,
    badge: null,
  },
  {
    slug: 'autocad-to-pdf',
    name: 'AutoCAD to PDF',
    desc: 'Convert architectural DWG and DXF engineering drawings into vector PDF blueprints.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#E5252A',
    badgeLetter: 'A',
    icon: Compass,
    badge: 'CAD',
  },
  {
    slug: 'publisher-to-pdf',
    name: 'Publisher to PDF',
    desc: 'Convert Microsoft Publisher (.pub) marketing layouts and brochures into PDF files.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#007A78',
    badgeLetter: 'P',
    icon: LayoutTemplate,
    badge: null,
  },
  {
    slug: 'dicom-to-pdf',
    name: 'DICOM to PDF',
    desc: 'Convert medical DICOM (.dcm) radiological scans (X-ray, MRI) into clinical reports.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#00838F',
    badgeLetter: 'D',
    icon: Activity,
    badge: 'Medical',
  },
  {
    slug: 'eps-to-pdf',
    name: 'EPS to PDF',
    desc: 'Convert vector Encapsulated PostScript (.eps) illustrations and logos to PDF format.',
    group: 'Convert to PDF',
    filterCat: 'COMPRESS_CONVERT',
    solidBg: '#4527A0',
    badgeLetter: 'E',
    icon: PenTool,
    badge: null,
  },
  // iWork to PDF
  {
    slug: 'pages-to-pdf',
    name: 'Pages to PDF',
    desc: 'Convert Apple Pages (.pages) documents into universal PDF files.',
    group: 'iWork to PDF',
    filterCat: 'OFFICE',
    solidBg: '#1E88E5',
    icon: PenTool,
    badge: 'Apple',
  },

  // ==========================================
  // COLUMN 4: Organize
  // ==========================================
  {
    slug: 'merge',
    name: 'Merge PDF',
    desc: 'Combine multiple PDFs into one unified document in any custom order.',
    group: 'Organize',
    filterCat: 'ORGANIZE',
    solidBg: '#7C3AED',
    icon: Combine,
    badge: 'Popular',
  },
  {
    slug: 'split',
    name: 'Split PDF',
    desc: 'Separate one or multiple pages into clean independent PDF files.',
    group: 'Organize',
    filterCat: 'ORGANIZE',
    solidBg: '#7C3AED',
    icon: Scissors,
    badge: null,
  },
  {
    slug: 'rotate',
    name: 'Rotate PDF',
    desc: 'Rotate individual pages or the entire PDF document permanently.',
    group: 'Organize',
    filterCat: 'ORGANIZE',
    solidBg: '#7C3AED',
    icon: RotateCw,
    badge: null,
  },
  {
    slug: 'delete-pages',
    name: 'Delete PDF Pages',
    desc: 'Remove unwanted, blank, or sensitive pages permanently from any PDF document.',
    group: 'Organize',
    filterCat: 'ORGANIZE',
    solidBg: '#7C3AED',
    icon: Trash2,
    badge: null,
  },
  {
    slug: 'extract-pages',
    name: 'Extract PDF Pages',
    desc: 'Extract specific pages or page ranges from a PDF into an independent document.',
    group: 'Organize',
    filterCat: 'ORGANIZE',
    solidBg: '#7C3AED',
    icon: Layers,
    badge: null,
  },
  {
    slug: 'organize',
    name: 'Organize PDF',
    desc: 'Rearrange, rotate, and delete pages inside your PDF documents with visual reordering.',
    group: 'Organize',
    filterCat: 'ORGANIZE',
    solidBg: '#7C3AED',
    icon: FolderTree,
    badge: null,
  },

  // ==========================================
  // COLUMN 5: Edit
  // ==========================================
  {
    slug: 'edit-pdf',
    name: 'Edit PDF',
    desc: 'Add text, shapes, notes, and highlights directly into your PDF document.',
    group: 'Edit',
    filterCat: 'EDIT',
    solidBg: '#0D9488',
    badgeLetter: 'T',
    icon: Type,
    badge: 'New',
  },
  {
    slug: 'annotator',
    name: 'PDF Annotator',
    desc: 'Highlight, underline, strikethrough, and add sticky comments to PDF documents.',
    group: 'Edit',
    filterCat: 'EDIT',
    solidBg: '#0D9488',
    icon: Highlighter,
    badge: null,
  },
  {
    slug: 'reader',
    name: 'PDF Reader',
    desc: 'Ultra-fast, distraction-free in-browser PDF viewer and document reader.',
    group: 'Edit',
    filterCat: 'EDIT',
    solidBg: '#0D9488',
    icon: Eye,
    badge: null,
  },
  {
    slug: 'number-pages',
    name: 'Number Pages',
    desc: 'Add custom page numbers, bates numbering, and header/footer stamps to your PDF.',
    group: 'Edit',
    filterCat: 'EDIT',
    solidBg: '#0D9488',
    icon: Hash,
    badge: null,
  },
  {
    slug: 'crop',
    name: 'Crop PDF',
    desc: 'Trim page margins, remove white space, or crop specific regions of PDF documents.',
    group: 'Edit',
    filterCat: 'EDIT',
    solidBg: '#0D9488',
    icon: Crop,
    badge: null,
  },
  {
    slug: 'redact',
    name: 'Redact PDF',
    desc: 'Permanently remove sensitive text, numbers, and private regions from documents.',
    group: 'Edit',
    filterCat: 'EDIT',
    solidBg: '#0D9488',
    icon: EyeOff,
    badge: 'Legal',
  },
  {
    slug: 'watermark',
    name: 'Watermark PDF',
    desc: 'Stamp custom text or logo image watermarks across every page of your PDF.',
    group: 'Edit',
    filterCat: 'EDIT',
    solidBg: '#0D9488',
    icon: Stamp,
    badge: null,
  },
  {
    slug: 'form-filler',
    name: 'PDF Form Filler',
    desc: 'Fill out interactive Acrobat AcroForms and XFA PDF form fields online.',
    group: 'Edit',
    filterCat: 'EDIT',
    solidBg: '#0D9488',
    icon: CheckSquare,
    badge: null,
  },
  {
    slug: 'share',
    name: 'Share PDF',
    desc: 'Generate secure, expiring view and download links for instant document sharing.',
    group: 'Edit',
    filterCat: 'EDIT',
    solidBg: '#0D9488',
    icon: Share2,
    badge: null,
  },

  // ==========================================
  // COLUMN 6: Fill & Sign, Protect
  // ==========================================
  // Fill & Sign
  {
    slug: 'esign',
    name: 'Sign PDF',
    desc: 'Draw or type legally binding electronic signatures with audit certificate stamps.',
    group: 'Fill & Sign',
    filterCat: 'SIGN_PROTECT',
    solidBg: '#E91E63',
    icon: FilePenLine,
    badge: 'PRO',
  },
  {
    slug: 'request-signatures',
    name: 'Request Signatures',
    desc: 'Send signature requests to multiple recipients with automated reminders and audit tracking.',
    group: 'Fill & Sign',
    filterCat: 'SIGN_PROTECT',
    solidBg: '#EAB308',
    icon: Send,
    badge: 'Workflow',
  },
  // Protect
  {
    slug: 'unlock',
    name: 'Unlock PDF',
    desc: 'Remove passwords and permissions from encrypted PDF documents.',
    group: 'Protect',
    filterCat: 'SIGN_PROTECT',
    solidBg: '#F43F5E',
    icon: Unlock,
    badge: null,
  },
  {
    slug: 'protect',
    name: 'Protect PDF',
    desc: 'Lock documents with unbreakable 256-bit AES encryption passwords.',
    group: 'Protect',
    filterCat: 'SIGN_PROTECT',
    solidBg: '#F43F5E',
    icon: Lock,
    badge: 'AES-256',
  },
  {
    slug: 'flatten',
    name: 'Flatten PDF',
    desc: 'Bake interactive fillable form fields and digital annotations into static page content.',
    group: 'Protect',
    filterCat: 'SIGN_PROTECT',
    solidBg: '#F43F5E',
    icon: Layers,
    badge: null,
  },
  {
    slug: 'repair',
    name: 'Repair PDF',
    desc: 'Recover and repair damaged, corrupted, or unreadable PDF files.',
    group: 'Protect',
    filterCat: 'SIGN_PROTECT',
    solidBg: '#F43F5E',
    icon: Wrench,
    badge: 'Rescue',
  },
  {
    slug: 'print-ready',
    name: 'Print-Ready PDF',
    desc: 'Prepress prep: flatten transparency, convert to CMYK, and configure trim marks.',
    group: 'Protect',
    filterCat: 'SIGN_PROTECT',
    solidBg: '#F43F5E',
    icon: Printer,
    badge: 'Print',
  },
];

// 6-Column Directory Structure matching screenshot layout
const DIRECTORY_COLUMNS: DirectoryColumn[] = [
  {
    colIndex: 1,
    groups: [
      { title: 'Compress', tools: ALL_TOOLS.filter((t) => t.group === 'Compress') },
      { title: 'Convert', tools: ALL_TOOLS.filter((t) => t.group === 'Convert') },
      { title: 'PDF to Image', tools: ALL_TOOLS.filter((t) => t.group === 'PDF to Image') },
      { title: 'Image to PDF', tools: ALL_TOOLS.filter((t) => t.group === 'Image to PDF') },
    ],
  },
  {
    colIndex: 2,
    groups: [
      { title: 'PDF to Office', tools: ALL_TOOLS.filter((t) => t.group === 'PDF to Office') },
      { title: 'Office to PDF', tools: ALL_TOOLS.filter((t) => t.group === 'Office to PDF') },
      { title: 'OpenOffice to PDF', tools: ALL_TOOLS.filter((t) => t.group === 'OpenOffice to PDF') },
    ],
  },
  {
    colIndex: 3,
    groups: [
      { title: 'Convert to PDF', tools: ALL_TOOLS.filter((t) => t.group === 'Convert to PDF') },
      { title: 'iWork to PDF', tools: ALL_TOOLS.filter((t) => t.group === 'iWork to PDF') },
    ],
  },
  {
    colIndex: 4,
    groups: [
      { title: 'Organize', tools: ALL_TOOLS.filter((t) => t.group === 'Organize') },
    ],
  },
  {
    colIndex: 5,
    groups: [
      { title: 'Edit', tools: ALL_TOOLS.filter((t) => t.group === 'Edit') },
    ],
  },
  {
    colIndex: 6,
    groups: [
      { title: 'Fill & Sign', tools: ALL_TOOLS.filter((t) => t.group === 'Fill & Sign') },
      { title: 'Protect', tools: ALL_TOOLS.filter((t) => t.group === 'Protect') },
    ],
  },
];

const CATEGORIES: { key: CategoryFilter; label: string; count: number }[] = [
  { key: 'ALL', label: 'All Tools', count: ALL_TOOLS.length },
  { key: 'COMPRESS_CONVERT', label: 'Compress & Convert', count: ALL_TOOLS.filter((t) => t.filterCat === 'COMPRESS_CONVERT').length },
  { key: 'OFFICE', label: 'Office & Docs', count: ALL_TOOLS.filter((t) => t.filterCat === 'OFFICE').length },
  { key: 'ORGANIZE', label: 'Organize', count: ALL_TOOLS.filter((t) => t.filterCat === 'ORGANIZE').length },
  { key: 'EDIT', label: 'Edit & Annotate', count: ALL_TOOLS.filter((t) => t.filterCat === 'EDIT').length },
  { key: 'SIGN_PROTECT', label: 'Sign & Protect', count: ALL_TOOLS.filter((t) => t.filterCat === 'SIGN_PROTECT').length },
];

function ToolBadgeIcon({ tool, size = 'sm' }: { tool: ToolItem; size?: 'sm' | 'lg' }) {
  const Icon = tool.icon;

  if (tool.badgeLetter) {
    const isMultiChar = tool.badgeLetter.length > 2;
    if (size === 'lg') {
      return (
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <div className="w-9 h-11 rounded-[6px] border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 flex flex-col justify-center items-end pr-1.5 gap-1 shadow-sm">
            <div className="w-4 h-0.5 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
            <div className="w-5 h-0.5 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
            <div className="w-3.5 h-0.5 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
          </div>
          <div
            className={`absolute bottom-0 left-0 ${isMultiChar ? 'px-1.5 py-0.5 text-[9px]' : 'w-6 h-6 text-xs'} rounded-[4px] flex items-center justify-center text-white font-bold shadow-md leading-none`}
            style={{ backgroundColor: tool.solidBg }}
          >
            {tool.badgeLetter}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${isMultiChar ? 'px-1.5 py-0.5 min-w-[28px] h-6' : 'w-6 h-6'} rounded-[5px] flex items-center justify-center text-white font-bold text-[10px] shadow-xs shrink-0 tracking-tight leading-none`}
        style={{ backgroundColor: tool.solidBg }}
      >
        {tool.badgeLetter}
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
        style={{ backgroundColor: tool.solidBg }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
    );
  }

  return (
    <div
      className="w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0 text-white shadow-xs"
      style={{ backgroundColor: tool.solidBg }}
    >
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'DIRECTORY' | 'GRID'>('DIRECTORY');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'ALL' || tool.filterCat === activeCategory;
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          <span className="text-xs font-medium text-[var(--muted)]">50+ High-Speed Tools • 100% Permissive Engines</span>
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
                Choose from 50+ specialized tools organized for lightning-fast conversion, compression, editing, and legal security.
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search 50+ tools..."
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
                  title="Directory View"
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

        {/* 6-COLUMN DIRECTORY VIEW (Matching user's screenshot layout) */}
        {viewMode === 'DIRECTORY' && !searchQuery && activeCategory === 'ALL' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
            {DIRECTORY_COLUMNS.map((col) => (
              <div key={col.colIndex} className="flex flex-col gap-6">
                {col.groups.map((group) => (
                  <div key={group.title} className="flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
                      {group.title}
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {group.tools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          className="group flex items-center gap-2.5 p-1 rounded-lg hover:bg-[var(--soft)] transition-all"
                        >
                          <ToolBadgeIcon tool={tool} size="sm" />
                          <span className="text-xs font-medium text-[var(--ink)] group-hover:text-[var(--primary-500)] transition-colors tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                            {tool.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* GRID VIEW (Rich Cards with Descriptions & Metadata) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                  <GlowCard className="p-6 h-full flex flex-col justify-between group-hover:border-[var(--primary-500)] transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <ToolBadgeIcon tool={tool} size="lg" />
                        {tool.badge && (
                          <Badge variant={tool.badge === 'PRO' ? 'pro' : 'outline'}>
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
                        {tool.group}
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
