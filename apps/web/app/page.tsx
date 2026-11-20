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
  ArrowRight,
  ShieldCheck,
  CheckCircle,
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
  Shield,
  Download,
  Smartphone,
  Monitor,
  Apple,
} from 'lucide-react';

type FilterCategory =
  | 'ALL'
  | 'WORKFLOWS'
  | 'ORGANIZE'
  | 'OPTIMIZE'
  | 'CONVERT'
  | 'EDIT'
  | 'SECURITY';

interface ILoveTool {
  slug: string;
  name: string;
  desc: string;
  cat: FilterCategory;
  tileBg: string;
  badgeLetter?: string;
  isNew?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const ILOVE_TOOLS: ILoveTool[] = [
  // 1. Merge PDF
  {
    slug: 'merge',
    name: 'Merge PDF',
    desc: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    cat: 'ORGANIZE',
    tileBg: '#EA580C',
    icon: Combine,
  },
  // 2. Split PDF
  {
    slug: 'split',
    name: 'Split PDF',
    desc: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    cat: 'ORGANIZE',
    tileBg: '#EA580C',
    icon: Scissors,
  },
  // 3. Compress PDF
  {
    slug: 'compress',
    name: 'Compress PDF',
    desc: 'Reduce file size while optimizing for maximal PDF quality.',
    cat: 'OPTIMIZE',
    tileBg: '#10B981',
    icon: Minimize2,
  },
  // 4. PDF to Word
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    desc: 'Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.',
    cat: 'CONVERT',
    tileBg: '#185ABD',
    badgeLetter: 'W',
    icon: FileText,
  },
  // 5. PDF to PowerPoint
  {
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    desc: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
    cat: 'CONVERT',
    tileBg: '#D83B01',
    badgeLetter: 'P',
    icon: Presentation,
  },
  // 6. PDF to Excel
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    desc: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
    cat: 'CONVERT',
    tileBg: '#107C41',
    badgeLetter: 'X',
    icon: FileSpreadsheet,
  },
  // 7. Word to PDF
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    desc: 'Make DOC and DOCX files easy to read by converting them to PDF.',
    cat: 'CONVERT',
    tileBg: '#185ABD',
    badgeLetter: 'W',
    icon: FileText,
  },
  // 8. PowerPoint to PDF
  {
    slug: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    desc: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
    cat: 'CONVERT',
    tileBg: '#D83B01',
    badgeLetter: 'P',
    icon: Presentation,
  },
  // 9. Excel to PDF
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    desc: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
    cat: 'CONVERT',
    tileBg: '#107C41',
    badgeLetter: 'X',
    icon: FileSpreadsheet,
  },
  // 10. Edit PDF
  {
    slug: 'edit-pdf',
    name: 'Edit PDF',
    desc: 'Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.',
    cat: 'EDIT',
    tileBg: '#7C3AED',
    badgeLetter: 'T',
    isNew: true,
    icon: Type,
  },
  // 11. PDF to JPG
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    desc: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
    cat: 'CONVERT',
    tileBg: '#F59E0B',
    icon: ImageIcon,
  },
  // 12. JPG to PDF
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    desc: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',
    cat: 'CONVERT',
    tileBg: '#F59E0B',
    badgeLetter: 'JPG',
    icon: ImageIcon,
  },
  // 13. Sign PDF
  {
    slug: 'esign',
    name: 'Sign PDF',
    desc: 'Sign yourself or request electronic signatures from others.',
    cat: 'SECURITY',
    tileBg: '#1E40AF',
    icon: FilePenLine,
  },
  // 14. Watermark
  {
    slug: 'watermark',
    name: 'Watermark',
    desc: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.',
    cat: 'EDIT',
    tileBg: '#7C3AED',
    icon: Stamp,
  },
  // 15. Rotate PDF
  {
    slug: 'rotate',
    name: 'Rotate PDF',
    desc: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
    cat: 'ORGANIZE',
    tileBg: '#7C3AED',
    icon: RotateCw,
  },
  // 16. HTML to PDF
  {
    slug: 'html-to-pdf',
    name: 'HTML to PDF',
    desc: 'Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.',
    cat: 'CONVERT',
    tileBg: '#F59E0B',
    badgeLetter: 'HTML',
    icon: FileCode,
  },
  // 17. Unlock PDF
  {
    slug: 'unlock',
    name: 'Unlock PDF',
    desc: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
    cat: 'SECURITY',
    tileBg: '#1E40AF',
    icon: Unlock,
  },
  // 18. Protect PDF
  {
    slug: 'protect',
    name: 'Protect PDF',
    desc: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
    cat: 'SECURITY',
    tileBg: '#1E40AF',
    icon: Lock,
  },
  // 19. Organize PDF
  {
    slug: 'organize',
    name: 'Organize PDF',
    desc: 'Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.',
    cat: 'ORGANIZE',
    tileBg: '#EA580C',
    icon: FolderTree,
  },
  // 20. PDF to PDF/A
  {
    slug: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    desc: 'Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving. Your PDF will preserve formatting when accessed in the future.',
    cat: 'CONVERT',
    tileBg: '#E53935',
    badgeLetter: '/A',
    icon: FileCheck,
  },
  // 21. Repair PDF
  {
    slug: 'repair',
    name: 'Repair PDF',
    desc: 'Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.',
    cat: 'OPTIMIZE',
    tileBg: '#E53935',
    icon: Wrench,
  },
  // 22. Page Numbers
  {
    slug: 'number-pages',
    name: 'Page Numbers',
    desc: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.',
    cat: 'EDIT',
    tileBg: '#7C3AED',
    icon: Hash,
  },
  // 23. OCR PDF
  {
    slug: 'ocr',
    name: 'OCR PDF',
    desc: 'Easily convert scanned PDF into searchable and selectable documents with high accuracy.',
    cat: 'OPTIMIZE',
    tileBg: '#E53935',
    badgeLetter: 'OCR',
    isNew: true,
    icon: ScanText,
  },
  // 24. Redact PDF
  {
    slug: 'redact',
    name: 'Redact PDF',
    desc: 'Permanently remove visible text and graphics from PDF documents with irreversible privacy security.',
    cat: 'SECURITY',
    tileBg: '#0D9488',
    icon: EyeOff,
  },
  // 25. Crop PDF
  {
    slug: 'crop',
    name: 'Crop PDF',
    desc: 'Crop PDF margins and select exact document areas with an interactive visual trimmer.',
    cat: 'EDIT',
    tileBg: '#7C3AED',
    icon: Crop,
  },
  // 26. Extract PDF Pages
  {
    slug: 'extract-pages',
    name: 'Extract PDF Pages',
    desc: 'Extract specific pages or page ranges into individual documents.',
    cat: 'ORGANIZE',
    tileBg: '#EA580C',
    icon: Layers,
  },
  // 27. Delete PDF Pages
  {
    slug: 'delete-pages',
    name: 'Delete PDF Pages',
    desc: 'Remove unwanted, blank, or sensitive pages permanently from any PDF.',
    cat: 'ORGANIZE',
    tileBg: '#EA580C',
    icon: Trash2,
  },
  // 28. PDF Form Filler
  {
    slug: 'form-filler',
    name: 'PDF Forms',
    desc: 'Fill interactive Acrobat PDF form fields, checkboxes, and text inputs directly in the browser.',
    cat: 'EDIT',
    tileBg: '#7C3AED',
    icon: CheckSquare,
  },
  // 29. PDF Reader
  {
    slug: 'reader',
    name: 'PDF Reader',
    desc: 'Fast, clean, in-browser PDF reader with bookmarks and continuous scrolling.',
    cat: 'WORKFLOWS',
    tileBg: '#0D9488',
    icon: Eye,
  },
  // 30. PDF Annotator
  {
    slug: 'annotator',
    name: 'PDF Annotator',
    desc: 'Highlight, underline, strikethrough, and add comments to PDF pages collaboratively.',
    cat: 'EDIT',
    tileBg: '#0D9488',
    icon: Highlighter,
  },
  // 31. Share PDF
  {
    slug: 'share',
    name: 'Share PDF',
    desc: 'Generate secure, expiring view and download links for instant document sharing.',
    cat: 'WORKFLOWS',
    tileBg: '#0D9488',
    icon: Share2,
  },
  // 32. Request Signatures
  {
    slug: 'request-signatures',
    name: 'Request Signatures',
    desc: 'Send signature requests to multiple recipients with automated reminders and audit tracking.',
    cat: 'SECURITY',
    tileBg: '#EAB308',
    icon: Send,
  },
  // 33. Flatten PDF
  {
    slug: 'flatten',
    name: 'Flatten PDF',
    desc: 'Bake interactive fillable form fields and digital annotations into static page content.',
    cat: 'SECURITY',
    tileBg: '#F43F5E',
    icon: Layers,
  },
  // 34. Print-Ready PDF
  {
    slug: 'print-ready',
    name: 'Print-Ready PDF',
    desc: 'Prepress prep: flatten transparency, convert to CMYK, and configure trim marks.',
    cat: 'OPTIMIZE',
    tileBg: '#E53935',
    icon: Printer,
  },
  // 35. PDF Converter
  {
    slug: 'pdf-converter',
    name: 'PDF Converter',
    desc: 'Universal smart converter: drop any document, spreadsheet, image, or presentation.',
    cat: 'CONVERT',
    tileBg: '#E53935',
    icon: FileCog,
  },
  // 36. TXT to PDF
  {
    slug: 'txt-to-pdf',
    name: 'TXT to PDF',
    desc: 'Convert plain text files into cleanly formatted, printable PDF documents.',
    cat: 'CONVERT',
    tileBg: '#1E88E5',
    badgeLetter: 'TXT',
    icon: FileText,
  },
  // 37. RTF to PDF
  {
    slug: 'rtf-to-pdf',
    name: 'RTF to PDF',
    desc: 'Convert Rich Text Format (.rtf) documents to PDF with styled text preservation.',
    cat: 'CONVERT',
    tileBg: '#1E88E5',
    badgeLetter: 'RTF',
    icon: FileText,
  },
  // 38. HWP to PDF
  {
    slug: 'hwp-to-pdf',
    name: 'HWP to PDF',
    desc: 'Convert Hancom Hangul Word Processor (.hwp, .hwpx) Korean documents into standard PDF.',
    cat: 'CONVERT',
    tileBg: '#1E88E5',
    badgeLetter: 'HWP',
    icon: FileText,
  },
  // 39. EPUB to PDF
  {
    slug: 'epub-to-pdf',
    name: 'EPUB to PDF',
    desc: 'Convert EPUB eBook files into printable and shareable PDF documents.',
    cat: 'CONVERT',
    tileBg: '#1E88E5',
    badgeLetter: 'EPUB',
    icon: BookOpen,
  },
  // 40. ZIP to PDF
  {
    slug: 'zip-to-pdf',
    name: 'ZIP to PDF',
    desc: 'Unpack files inside a ZIP archive and compile them into a unified PDF document.',
    cat: 'CONVERT',
    tileBg: '#1E88E5',
    badgeLetter: 'ZIP',
    icon: FolderArchive,
  },
  // 41. CSV to PDF
  {
    slug: 'csv-to-pdf',
    name: 'CSV to PDF',
    desc: 'Convert raw CSV spreadsheets into clean, paginated tabular PDF reports.',
    cat: 'CONVERT',
    tileBg: '#107C41',
    badgeLetter: 'CSV',
    icon: FileSpreadsheet,
  },
  // 42. ODT to PDF
  {
    slug: 'odt-to-pdf',
    name: 'ODT to PDF',
    desc: 'Convert OpenDocument Text (.odt) documents into standardized PDF files.',
    cat: 'CONVERT',
    tileBg: '#0288D1',
    badgeLetter: 'ODT',
    icon: FileText,
  },
  // 43. ODS to PDF
  {
    slug: 'ods-to-pdf',
    name: 'ODS to PDF',
    desc: 'Convert OpenDocument Spreadsheet (.ods) files to standardized, printable PDF pages.',
    cat: 'CONVERT',
    tileBg: '#107C41',
    badgeLetter: 'ODS',
    icon: FileSpreadsheet,
  },
  // 44. ODP to PDF
  {
    slug: 'odp-to-pdf',
    name: 'ODP to PDF',
    desc: 'Convert OpenDocument Presentation (.odp) slide decks into clean PDF documents.',
    cat: 'CONVERT',
    tileBg: '#D83B01',
    badgeLetter: 'ODP',
    icon: Presentation,
  },
  // 45. Pages to PDF
  {
    slug: 'pages-to-pdf',
    name: 'Pages to PDF',
    desc: 'Convert Apple Pages (.pages) documents into universal PDF files.',
    cat: 'CONVERT',
    tileBg: '#1E88E5',
    icon: PenTool,
  },
  // 46. AutoCAD to PDF
  {
    slug: 'autocad-to-pdf',
    name: 'AutoCAD to PDF',
    desc: 'Convert architectural DWG and DXF engineering drawings into vector PDF blueprints.',
    cat: 'CONVERT',
    tileBg: '#E5252A',
    badgeLetter: 'A',
    icon: Compass,
  },
  // 47. Publisher to PDF
  {
    slug: 'publisher-to-pdf',
    name: 'Publisher to PDF',
    desc: 'Convert Microsoft Publisher (.pub) marketing layouts and brochures into PDF files.',
    cat: 'CONVERT',
    tileBg: '#007A78',
    badgeLetter: 'P',
    icon: LayoutTemplate,
  },
  // 48. DICOM to PDF
  {
    slug: 'dicom-to-pdf',
    name: 'DICOM to PDF',
    desc: 'Convert medical DICOM (.dcm) radiological scans into clinical PDF reports.',
    cat: 'CONVERT',
    tileBg: '#00838F',
    badgeLetter: 'D',
    icon: Activity,
  },
  // 49. EPS to PDF
  {
    slug: 'eps-to-pdf',
    name: 'EPS to PDF',
    desc: 'Convert vector Encapsulated PostScript (.eps) illustrations and logos to PDF format.',
    cat: 'CONVERT',
    tileBg: '#4527A0',
    badgeLetter: 'E',
    icon: PenTool,
  },
];

const FILTER_PILLS: { key: FilterCategory; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'WORKFLOWS', label: 'Workflows' },
  { key: 'ORGANIZE', label: 'Organize PDF' },
  { key: 'OPTIMIZE', label: 'Optimize PDF' },
  { key: 'CONVERT', label: 'Convert PDF' },
  { key: 'EDIT', label: 'Edit PDF' },
  { key: 'SECURITY', label: 'PDF Security' },
];

function CardBadge({ tool }: { tool: ILoveTool }) {
  const Icon = tool.icon;

  if (tool.badgeLetter) {
    const isMultiChar = tool.badgeLetter.length > 2;
    return (
      <div
        className={`${
          isMultiChar ? 'px-2 py-1 min-w-[36px] h-9' : 'w-10 h-10'
        } rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs leading-none`}
        style={{ backgroundColor: tool.tileBg }}
      >
        {tool.badgeLetter}
      </div>
    );
  }

  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
      style={{ backgroundColor: tool.tileBg }}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
  );
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return ILOVE_TOOLS.filter((tool) => {
      const matchesCategory = activeFilter === 'ALL' || tool.cat === activeFilter;
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafc] dark:bg-[#0c0c12] antialiased">
      {/* 1. HERO SECTION (iLovePDF Style) */}
      <section className="pt-16 sm:pt-20 pb-10 px-4 sm:px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#181b20] dark:text-white tracking-[-0.02em] leading-[1.18]">
          Every tool you need to work with PDFs in one place
        </h1>

        <p className="text-base sm:text-lg text-[#4a5568] dark:text-[#94a3b8] font-normal max-w-3xl leading-relaxed mt-4">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
        </p>

        {/* 2. CATEGORY FILTER PILL BAR & SEARCH (iLovePDF Style) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.key}
              type="button"
              onClick={() => setActiveFilter(pill.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeFilter === pill.key
                  ? 'bg-[#181b20] dark:bg-white text-white dark:text-[#181b20] shadow-sm'
                  : 'bg-white dark:bg-[#1a1a24] text-[#4a5568] dark:text-[#94a3b8] border border-[#e2e8f0] dark:border-[#2a2a38] hover:border-[#cbd5e1] hover:text-[#181b20] dark:hover:text-white'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Search Filter */}
        <div className="mt-4 w-full max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search all PDF tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white dark:bg-[#1a1a24] border border-[#e2e8f0] dark:border-[#2a2a38] text-[#181b20] dark:text-white placeholder-[#94a3b8] focus:outline-none focus:border-[var(--primary-500)] shadow-xs"
          />
        </div>
      </section>

      {/* 3. MAIN TOOLS GRID (iLovePDF 4-Column Card Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#161622] border border-[#f1f1f5] dark:border-[#222230] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-2 hover:border-[#181b20] dark:hover:border-white transition-all duration-150 flex flex-col justify-start min-h-[210px]"
            >
              <div className="flex items-center justify-between mb-4">
                <CardBadge tool={tool} />
                {tool.isNew && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    New!
                  </span>
                )}
              </div>

              <h3 className="font-heading font-bold text-xl text-[#181b20] dark:text-white tracking-tight group-hover:text-[var(--primary-500)] transition-colors">
                {tool.name}
              </h3>

              <p className="text-sm text-[#4a5568] dark:text-[#94a3b8] font-normal leading-relaxed mt-2 line-clamp-3">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#161622] rounded-2xl border border-[#e2e8f0] dark:border-[#222230]">
            <p className="text-sm text-[#64748b]">No tools found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('ALL');
              }}
              className="mt-3 text-xs font-bold text-[var(--primary-500)] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* 4. PRE-FOOTER TRUST & COMPLIANCE BAR (Directly from iLovePDF) */}
      <section className="w-full bg-white dark:bg-[#14141c] border-t border-[#e2e8f0] dark:border-[#222230] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-8">
          <p className="text-base sm:text-lg text-[#181b20] dark:text-neutral-200 font-medium leading-relaxed max-w-2xl">
            SimplifyPDF is your number one web app for editing PDF with ease. Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#181b20] dark:text-white">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <span>ISO 27001 Certified</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#181b20] dark:text-white">
              <Lock className="w-5 h-5 text-blue-500" />
              <span>Secure SSL Encryption</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#181b20] dark:text-white">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <span>100% Permissive Engines</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER (iLovePDF Style 5 Columns & App Badges) */}
      <footer className="w-full bg-[#1f242d] text-white/80 pt-16 pb-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-white/10">
            {/* Column 1: PRODUCT */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Product
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-white/70">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/tools/compress" className="hover:text-white transition-colors">Compress PDF</Link></li>
                <li><Link href="/tools/merge" className="hover:text-white transition-colors">Merge PDF</Link></li>
                <li><Link href="/tools/word-to-pdf" className="hover:text-white transition-colors">Convert PDF</Link></li>
              </ul>
            </div>

            {/* Column 2: RESOURCES */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Resources
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-white/70">
                <li><Link href="/tools/esign" className="hover:text-white transition-colors">SimplifySign</Link></li>
                <li><Link href="/tools/ocr" className="hover:text-white transition-colors">OCR Engine</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security Guard</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Guides</Link></li>
              </ul>
            </div>

            {/* Column 3: SOLUTIONS */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Solutions
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-white/70">
                <li><span className="text-white/70">Business</span></li>
                <li><span className="text-white/70">Education</span></li>
                <li><span className="text-white/70">Legal Compliance</span></li>
              </ul>
            </div>

            {/* Column 4: LEGAL */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Legal
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-white/70">
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><span className="text-white/70">Cookie Policy</span></li>
              </ul>
            </div>

            {/* Column 5: COMPANY */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Company
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-white/70">
                <li><span className="text-white/70">About Us</span></li>
                <li><span className="text-white/70">Contact Us</span></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">News & Updates</Link></li>
              </ul>
            </div>

            {/* Column 6: APP BADGES */}
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Applications
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer text-xs">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/60 uppercase">Get it on</span>
                    <span className="font-bold">Google Play</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer text-xs">
                  <Apple className="w-4 h-4 text-white" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/60 uppercase">Download on</span>
                    <span className="font-bold">App Store</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer text-xs">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/60 uppercase">Available for</span>
                    <span className="font-bold">Mac & Windows</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subfooter */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5 cursor-pointer">
                🌐 English ▾
              </span>
            </div>

            <p className="text-center sm:text-right">
              © SimplifyPDF 2026 ® - Your High-Speed PDF Editor. Zero telemetry. Automatic file shredding.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
