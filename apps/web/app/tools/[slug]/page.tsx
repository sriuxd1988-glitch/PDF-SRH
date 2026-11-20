import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolView } from './ToolView';
import { getToolContent } from '../../../lib/tool-content';

const ALL_TOOLS: Record<string, { title: string; toolType: string; desc: string; maxMb: number; tips: string[] }> = {
  // --- Category: Merge & Split ---
  compress: {
    title: 'Compress PDF',
    toolType: 'COMPRESS',
    desc: 'Reduce PDF file size by up to 85% while keeping crisp vector fonts and sharp images.',
    maxMb: 50,
    tips: ['Linearizes file for fast web streaming', 'Downsamples raster images to 150 DPI', 'Removes unreferenced object streams'],
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

  // --- Category: Convert to PDF ---
  'word-to-pdf': {
    title: 'Word to PDF',
    toolType: 'WORD_TO_PDF',
    desc: 'Convert DOC and DOCX Word documents into standard high-fidelity PDF files.',
    maxMb: 50,
    tips: ['Headless LibreOffice conversion', 'Zero font substitution artifacts', 'Instant page layout preservation'],
  },
  'excel-to-pdf': {
    title: 'Excel to PDF',
    toolType: 'EXCEL_TO_PDF',
    desc: 'Convert XLS and XLSX spreadsheets to standardized, printable PDF pages.',
    maxMb: 50,
    tips: ['Preserves cell borders and chart fidelity', 'Fits sheets neatly to standard page dimensions', 'Zero formulas recalculation lag'],
  },
  'powerpoint-to-pdf': {
    title: 'PowerPoint to PDF',
    toolType: 'POWERPOINT_TO_PDF',
    desc: 'Convert PPT and PPTX presentation slide decks into clean vector PDF documents.',
    maxMb: 50,
    tips: ['Converts 1 slide per PDF page', 'Crisp vector rendering for presentation graphics', 'Embeds font assets faithfully'],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF',
    toolType: 'IMAGES_TO_PDF',
    desc: 'Compile one or multiple JPG photos into a single unified PDF document.',
    maxMb: 50,
    tips: ['Auto-rotates images according to EXIF orientation', 'Fits to standard A4 / US Letter pages', 'Lossless compression mode option'],
  },
  'images-to-pdf': {
    title: 'JPG to PDF',
    toolType: 'IMAGES_TO_PDF',
    desc: 'Turn JPG, PNG, and WebP images into a standardized single PDF file.',
    maxMb: 50,
    tips: ['Auto-rotates images according to EXIF data', 'Fits to standard A4 / US Letter pages', 'Zero compression loss option'],
  },
  'png-to-pdf': {
    title: 'PNG to PDF',
    toolType: 'PNG_TO_PDF',
    desc: 'Convert PNG graphics and screenshots into clean PDF documents with transparency preservation.',
    maxMb: 50,
    tips: ['Alpha channel transparency preserved', 'Supports multi-image compilation', 'High DPI resolution maintained'],
  },
  'heic-to-pdf': {
    title: 'HEIC to PDF',
    toolType: 'HEIC_TO_PDF',
    desc: 'Convert Apple iPhone HEIC and HEIF photos into universal PDF documents.',
    maxMb: 50,
    tips: ['Supports direct iOS High Efficiency image formats', 'Preserves HDR color depth and metadata', 'Instant browser compilation'],
  },
  'autocad-to-pdf': {
    title: 'AutoCAD to PDF',
    toolType: 'AUTOCAD_TO_PDF',
    desc: 'Convert architectural DWG and DXF engineering drawings into vector PDF blueprints.',
    maxMb: 50,
    tips: ['High-precision CAD vector line rendering', 'Retains layers and scale dimensions', 'Printable on A1, A0, and Arch D paper'],
  },
  'openoffice-to-pdf': {
    title: 'OpenOffice to PDF',
    toolType: 'OPENOFFICE_TO_PDF',
    desc: 'Convert OpenDocument formats (.odt, .ods, .odp) into standardized PDF files.',
    maxMb: 50,
    tips: ['100% native OpenDocument specification support', 'Zero formatting displacement', 'Standard compliant output'],
  },
  'ebooks-to-pdf': {
    title: 'eBooks to PDF',
    toolType: 'EBOOKS_TO_PDF',
    desc: 'Convert EPUB, MOBI, and Kindle eBook files into readable, printable PDF documents.',
    maxMb: 50,
    tips: ['Formatted chapter breaks and typography', 'Retains embedded illustrations and cover art', 'Page numbering generated automatically'],
  },
  'iwork-to-pdf': {
    title: 'iWork to PDF',
    toolType: 'IWORK_TO_PDF',
    desc: 'Convert Apple Pages, Numbers, and Keynote documents into standard PDF files.',
    maxMb: 50,
    tips: ['Seamless macOS / iOS document compatibility', 'Preserves Apple typography and layouts', 'Shareable on any non-Apple device'],
  },
  'publisher-to-pdf': {
    title: 'Publisher to PDF',
    toolType: 'PUBLISHER_TO_PDF',
    desc: 'Convert Microsoft Publisher (.pub) marketing layouts and brochures into standard PDF files.',
    maxMb: 50,
    tips: ['Converts desktop publishing layouts', 'Retains multi-column text frames', 'High-res print output'],
  },
  'dicom-to-pdf': {
    title: 'DICOM to PDF',
    toolType: 'DICOM_TO_PDF',
    desc: 'Convert medical DICOM (.dcm) radiological imaging scans (X-ray, MRI, CT) into clinical PDF reports.',
    maxMb: 50,
    tips: ['HIPAA compliant in-memory processing', 'Preserves diagnostic grayscale fidelity', 'Includes patient metadata headers'],
  },
  'eps-to-pdf': {
    title: 'EPS to PDF',
    toolType: 'EPS_TO_PDF',
    desc: 'Convert vector Encapsulated PostScript (.eps) illustrations and logos to PDF format.',
    maxMb: 50,
    tips: ['Infinitely scalable vector curves', 'Preserves spot colors and pantone palettes', 'Zero pixelation loss'],
  },

  // --- Category: Convert from PDF ---
  'pdf-to-word': {
    title: 'PDF to Word',
    toolType: 'PDF_TO_WORD',
    desc: 'Convert PDF files into fully editable Microsoft Word (.docx) documents.',
    maxMb: 50,
    tips: ['Retains editable tables and paragraphs', 'Extracts embedded images cleanly', 'High accuracy paragraph reflow'],
  },
  'pdf-to-excel': {
    title: 'PDF to Excel',
    toolType: 'PDF_TO_EXCEL',
    desc: 'Extract financial tables, ledgers, and data from PDF into editable Microsoft Excel (.xlsx) spreadsheets.',
    maxMb: 50,
    tips: ['Intelligent table grid detection', 'Numeric cell typing preservation', 'Multi-page tabular consolidation'],
  },
  'pdf-to-powerpoint': {
    title: 'PDF to PowerPoint',
    toolType: 'PDF_TO_POWERPOINT',
    desc: 'Convert presentation PDF slides into fully editable PowerPoint (.pptx) presentation decks.',
    maxMb: 50,
    tips: ['1 PDF page converts to 1 PPTX slide', 'Editable text boxes and background shapes', 'Preserves presentation aspect ratio (16:9)'],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG',
    toolType: 'PDF_TO_IMAGES',
    desc: 'Extract and rasterize PDF pages into high-resolution JPG image files.',
    maxMb: 50,
    tips: ['High-speed pypdfium2 rasterizer', 'Customizable 150/300 DPI resolution', 'Packaged in convenient ZIP archive'],
  },
  'pdf-to-images': {
    title: 'PDF to JPG',
    toolType: 'PDF_TO_IMAGES',
    desc: 'Convert PDF pages into high-resolution JPG or PNG image files.',
    maxMb: 50,
    tips: ['Powered by pypdfium2 BSD engine', 'Customizable 150/300 DPI rendering', 'Packaged as a direct ZIP download'],
  },
  'pdf-to-png': {
    title: 'PDF to PNG',
    toolType: 'PDF_TO_PNG',
    desc: 'Export PDF pages as crisp, transparent PNG images with maximum sharpness.',
    maxMb: 50,
    tips: ['Lossless PNG compression', 'Transparent background support', 'Ideal for web publishing and presentations'],
  },
  'extract-pdf-images': {
    title: 'Extract PDF Images',
    toolType: 'EXTRACT_PDF_IMAGES',
    desc: 'Unpack and extract all raw image assets embedded inside a PDF document.',
    maxMb: 50,
    tips: ['Extracts original uncompressed JPEG/PNG assets', 'Zero quality degradation or re-encoding', 'Zipped archive with individual files'],
  },
  'pdf-to-pdfa': {
    title: 'PDF to PDF/A',
    toolType: 'PDF_TO_PDFA',
    desc: 'Convert PDF documents to ISO-19005 compliant PDF/A for legal long-term archiving.',
    maxMb: 50,
    tips: ['Embeds all font definitions permanently', 'Strips non-compliant dynamic scripts', 'Meets government and courtroom filing standards'],
  },

  // --- Category: PDF Security ---
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
  redact: {
    title: 'Redact PDF',
    toolType: 'REDACT',
    desc: 'Permanently remove sensitive text, numbers, and private regions from documents.',
    maxMb: 50,
    tips: ['True stream sanitization (not black box overlay)', 'Complete metadata purge', 'Irreversible privacy guarantee'],
  },
  esign: {
    title: 'eSign PDF',
    toolType: 'ESIGN',
    desc: 'Apply legally binding electronic signatures with cryptographic audit certificate stamps.',
    maxMb: 50,
    tips: ['Draw, type or upload signatures', 'Cryptographic SHA-256 audit sheet appended', 'Complies with US ESIGN & eIDAS'],
  },

  // --- Category: PDF Tools & Utilities ---
  'pdf-converter': {
    title: 'PDF Converter',
    toolType: 'PDF_CONVERTER',
    desc: 'Universal smart converter: drop any document, spreadsheet, image, or presentation to convert instantly.',
    maxMb: 50,
    tips: ['Auto-detects 40+ file formats', 'Fast direct-to-PDF compilation', 'Single-click high speed processing'],
  },
  'delete-pages': {
    title: 'Delete PDF Pages',
    toolType: 'DELETE_PAGES',
    desc: 'Remove unwanted, blank, or sensitive pages permanently from any PDF document.',
    maxMb: 50,
    tips: ['Select specific page numbers to delete', 'Recalculates page flow and bookmarks', 'Zero damage to remaining pages'],
  },
  rotate: {
    title: 'Rotate PDF',
    toolType: 'ROTATE',
    desc: 'Rotate individual pages or the entire PDF document permanently.',
    maxMb: 50,
    tips: ['Fix inverted scans permanently', 'Rotate all pages 90, 180, 270 degrees', 'Preserves internal document links'],
  },
  flatten: {
    title: 'Flatten PDF',
    toolType: 'FLATTEN',
    desc: 'Bake interactive fillable form fields and digital annotations into regular static page content.',
    maxMb: 50,
    tips: ['Prevents further tampering with completed forms', 'Compatible with all legacy PDF viewers', 'Locks in signatures and text inputs'],
  },
  repair: {
    title: 'Repair PDF',
    toolType: 'REPAIR',
    desc: 'Recover and repair damaged, corrupted, or unreadable PDF files.',
    maxMb: 50,
    tips: ['Rebuilds corrupted XRef cross-reference tables', 'Recovers unreadable object streams', 'Permissive qpdf recovery engine'],
  },
  'print-ready': {
    title: 'Print-Ready PDF',
    toolType: 'PRINT_READY',
    desc: 'Prepress prep: flatten transparency, convert to CMYK, and configure standard printer trim marks.',
    maxMb: 50,
    tips: ['Preflight pre-press color optimization', 'Converts RGB color spaces for commercial print', 'Flattens transparency layers'],
  },
  ocr: {
    title: 'OCR PDF',
    toolType: 'OCR',
    desc: 'Extract selectable, searchable text from scanned paper PDF documents.',
    maxMb: 50,
    tips: ['Multilingual text recognition via Tesseract', 'Generates standard PDF/A format', 'Invisible searchable text overlay'],
  },
  organize: {
    title: 'Organize PDF',
    toolType: 'ORGANIZE',
    desc: 'Rearrange, rotate, and delete pages inside your PDF documents.',
    maxMb: 50,
    tips: ['Rotate pages 90, 180, 270 degrees', 'Delete unwanted pages with one click', 'Fast visual thumbnail previews'],
  },

  // --- Category: Extended Suite Additions ---
  'txt-to-pdf': {
    title: 'TXT to PDF',
    toolType: 'TXT_TO_PDF',
    desc: 'Convert plain text files into cleanly formatted, printable PDF documents.',
    maxMb: 50,
    tips: ['Preserves monospace font alignment', 'Automatic line wrapping & pagination', 'Standard UTF-8 encoding support'],
  },
  'rtf-to-pdf': {
    title: 'RTF to PDF',
    toolType: 'RTF_TO_PDF',
    desc: 'Convert Rich Text Format (.rtf) documents to PDF with styled text preservation.',
    maxMb: 50,
    tips: ['Retains bold, italics, and font styling', 'Preserves paragraph indentation', 'Instant vector PDF generation'],
  },
  'hwp-to-pdf': {
    title: 'HWP to PDF',
    toolType: 'HWP_TO_PDF',
    desc: 'Convert Hancom Hangul Word Processor (.hwp, .hwpx) Korean documents into standard PDF.',
    maxMb: 50,
    tips: ['Full Korean font set rendering', 'Preserves complex tables and layouts', 'Shareable on any non-Windows device'],
  },
  'html-to-pdf': {
    title: 'HTML to PDF',
    toolType: 'HTML_TO_PDF',
    desc: 'Convert HTML web pages and code files into high-fidelity vector PDF documents.',
    maxMb: 50,
    tips: ['Renders CSS styles and media queries', 'Crisp vector text and link retention', 'Clean printable page pagination'],
  },
  'epub-to-pdf': {
    title: 'EPUB to PDF',
    toolType: 'EPUB_TO_PDF',
    desc: 'Convert EPUB eBook files into printable and shareable PDF documents.',
    maxMb: 50,
    tips: ['Formatted chapter breaks and typography', 'Retains embedded illustrations and cover art', 'Page numbering generated automatically'],
  },
  'zip-to-pdf': {
    title: 'ZIP to PDF',
    toolType: 'ZIP_TO_PDF',
    desc: 'Unpack files inside a ZIP archive and compile them into a unified PDF document.',
    maxMb: 50,
    tips: ['Supports mixed images and documents in archive', 'Automatic file ordering', 'Zero temporary file persistence'],
  },
  'csv-to-pdf': {
    title: 'CSV to PDF',
    toolType: 'CSV_TO_PDF',
    desc: 'Convert raw CSV spreadsheets into clean, paginated tabular PDF reports.',
    maxMb: 50,
    tips: ['Automatic table column width fitting', 'Alternating row zebra striping', 'Fits wide data to landscape orientation'],
  },
  'odt-to-pdf': {
    title: 'ODT to PDF',
    toolType: 'ODT_TO_PDF',
    desc: 'Convert OpenDocument Text (.odt) documents into standardized PDF files.',
    maxMb: 50,
    tips: ['100% native OpenDocument specification support', 'Zero formatting displacement', 'Standard compliant output'],
  },
  'ods-to-pdf': {
    title: 'ODS to PDF',
    toolType: 'ODS_TO_PDF',
    desc: 'Convert OpenDocument Spreadsheet (.ods) files to standardized, printable PDF pages.',
    maxMb: 50,
    tips: ['Preserves cell borders and formulas', 'Neat page fitting', 'High-res charts and graphics'],
  },
  'odp-to-pdf': {
    title: 'ODP to PDF',
    toolType: 'ODP_TO_PDF',
    desc: 'Convert OpenDocument Presentation (.odp) slide decks into clean PDF documents.',
    maxMb: 50,
    tips: ['1 slide per PDF page conversion', 'Vector slide elements', 'Embeds presentation fonts'],
  },
  'pages-to-pdf': {
    title: 'Pages to PDF',
    toolType: 'PAGES_TO_PDF',
    desc: 'Convert Apple Pages (.pages) documents into universal PDF files.',
    maxMb: 50,
    tips: ['Native macOS & iOS Pages support', 'Preserves Apple typography and layouts', 'Shareable across Windows and Android'],
  },
  'extract-pages': {
    title: 'Extract PDF Pages',
    toolType: 'EXTRACT_PDF_PAGES',
    desc: 'Extract specific pages or page ranges from a PDF into an independent document.',
    maxMb: 50,
    tips: ['Enter custom page ranges (e.g., 2-5, 9)', 'Maintains original page DPI quality', 'Zero distortion of extracted pages'],
  },
  'edit-pdf': {
    title: 'Edit PDF',
    toolType: 'EDIT_PDF',
    desc: 'Add text, shapes, notes, and highlights directly into your PDF document.',
    maxMb: 50,
    tips: ['Interactive in-browser PDF editor', 'Add freehand drawings and callouts', 'Export with embedded modifications'],
  },
  annotator: {
    title: 'PDF Annotator',
    toolType: 'PDF_ANNOTATOR',
    desc: 'Highlight, underline, strikethrough, and add sticky comments to PDF documents.',
    maxMb: 50,
    tips: ['Collaborative markup tools', 'Color-coded highlighter pens', 'Standard ISO PDF annotation layer'],
  },
  reader: {
    title: 'PDF Reader',
    toolType: 'PDF_READER',
    desc: 'Ultra-fast, distraction-free in-browser PDF viewer and document reader.',
    maxMb: 50,
    tips: ['Zero lag continuous page scrolling', 'Dark mode reading view', 'Full-text keyword search and bookmarks'],
  },
  'number-pages': {
    title: 'Number Pages',
    toolType: 'NUMBER_PAGES',
    desc: 'Add custom page numbers, bates numbering, and header/footer stamps to your PDF.',
    maxMb: 50,
    tips: ['Custom placement (top, bottom, left, center, right)', 'Custom prefix and formatting (e.g. Page {n} of {total})', 'Exclude cover page option'],
  },
  crop: {
    title: 'Crop PDF',
    toolType: 'CROP',
    desc: 'Trim page margins, remove white space, or crop specific regions of PDF documents.',
    maxMb: 50,
    tips: ['Interactive visual crop boundary box', 'Apply crop to all pages or selected page range', 'Preserves underlying vector resolution'],
  },
  watermark: {
    title: 'Watermark PDF',
    toolType: 'WATERMARK',
    desc: 'Stamp custom text or logo image watermarks across every page of your PDF.',
    maxMb: 50,
    tips: ['Configurable opacity, angle, and size', 'Confidential, Draft, or custom text stamps', 'Non-removable background layer stamping'],
  },
  'form-filler': {
    title: 'PDF Form Filler',
    toolType: 'PDF_FORM_FILLER',
    desc: 'Fill out interactive Acrobat AcroForms and XFA PDF form fields online.',
    maxMb: 50,
    tips: ['Supports text boxes, checkboxes, and radio buttons', 'Auto-fill browser integration', 'Export fillable or flattened PDF'],
  },
  share: {
    title: 'Share PDF',
    toolType: 'SHARE_PDF',
    desc: 'Generate secure, expiring view and download links for instant document sharing.',
    maxMb: 50,
    tips: ['Password-protected shareable links', 'Configurable expiration timers (1h, 24h, 7d)', 'View-only mode with download restriction'],
  },
  'request-signatures': {
    title: 'Request Signatures',
    toolType: 'REQUEST_SIGNATURES',
    desc: 'Send signature requests to multiple recipients with automated reminders and audit tracking.',
    maxMb: 50,
    tips: ['Sequential or parallel signing orders', 'Automated email invitation and reminder pings', 'Cryptographic completion certificate'],
  },
};

export async function generateStaticParams() {
  return Object.keys(ALL_TOOLS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const tool = ALL_TOOLS[resolved.slug];
  if (!tool) return { title: 'Tool Not Found — SimplifyPDF' };

  const content = getToolContent(resolved.slug, tool);

  return {
    title: `${content.title} — 100% Free Online Tool | SimplifyPDF`,
    description: `${content.actionTitle}. ${content.tagline} Bank-grade 256-bit encryption, instant cloud processing, no watermarks, and 2-hour auto-shred.`,
    keywords: content.keywords,
    openGraph: {
      title: `${content.title} — Fast & Secure Online PDF Tool`,
      description: `${content.actionTitle}. ${content.tagline}`,
      url: `https://simplifypdf.com/tools/${resolved.slug}`,
      siteName: 'SimplifyPDF',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${content.title} — Free Online Tool | SimplifyPDF`,
      description: content.tagline,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const tool = ALL_TOOLS[resolved.slug];
  if (!tool) notFound();

  const content = getToolContent(resolved.slug, tool);

  // Full Rich JSON-LD Structured Data Schema for Google Search Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `SimplifyPDF ${content.title}`,
        operatingSystem: 'All',
        applicationCategory: 'UtilitiesApplication',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: content.ratingScore,
          reviewCount: content.ratingVotes.replace(/,/g, ''),
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: content.tagline,
      },
      {
        '@type': 'HowTo',
        name: content.actionTitle,
        description: `Step by step guide to ${content.shortVerb.toLowerCase()} ${content.noun} online for free.`,
        step: content.howToSteps.map((s) => ({
          '@type': 'HowToStep',
          position: s.step,
          name: s.title,
          text: s.desc,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: content.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://simplifypdf.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: 'https://simplifypdf.com/#tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: content.title,
            item: `https://simplifypdf.com/tools/${resolved.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolView slug={resolved.slug} tool={tool} />
    </>
  );
}
