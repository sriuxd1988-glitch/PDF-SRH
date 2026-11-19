import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolView } from './ToolView';

const ALL_TOOLS: Record<string, { title: string; toolType: string; desc: string; maxMb: number; tips: string[] }> = {
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
  ocr: {
    title: 'OCR PDF',
    toolType: 'OCR',
    desc: 'Extract selectable, searchable text from scanned paper PDF documents.',
    maxMb: 50,
    tips: ['Multilingual text recognition via Tesseract', 'Generates standard PDF/A format', 'Invisible searchable text overlay'],
  },
  esign: {
    title: 'eSign PDF',
    toolType: 'ESIGN',
    desc: 'Apply legally binding electronic signatures with cryptographic audit certificate stamps.',
    maxMb: 50,
    tips: ['Draw, type or upload signatures', 'Cryptographic SHA-256 audit sheet appended', 'Complies with US ESIGN & eIDAS'],
  },
  redact: {
    title: 'Redact PDF',
    toolType: 'REDACT',
    desc: 'Permanently remove sensitive text, numbers, and private regions from documents.',
    maxMb: 50,
    tips: ['True stream sanitization (not black box overlay)', 'Complete metadata purge', 'Irreversible privacy guarantee'],
  },
  organize: {
    title: 'Organize PDF',
    toolType: 'ORGANIZE',
    desc: 'Rearrange, rotate, and delete pages inside your PDF documents.',
    maxMb: 50,
    tips: ['Rotate pages 90, 180, 270 degrees', 'Delete unwanted pages with one click', 'Fast visual thumbnail previews'],
  },
  rotate: {
    title: 'Rotate PDF',
    toolType: 'ROTATE',
    desc: 'Rotate individual pages or the entire PDF permanently.',
    maxMb: 50,
    tips: ['Fix inverted scans permanently', 'Rotate all pages simultaneously', 'Preserves internal document links'],
  },
};

export async function generateStaticParams() {
  return Object.keys(ALL_TOOLS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const tool = ALL_TOOLS[resolved.slug];
  if (!tool) return { title: 'Tool Not Found — SimplifyPDF' };

  return {
    title: `${tool.title} — Free Online Tool | SimplifyPDF`,
    description: tool.desc,
    openGraph: {
      title: `${tool.title} — High-Speed Permissive PDF Processing`,
      description: tool.desc,
      url: `https://simplifypdf.com/tools/${resolved.slug}`,
      siteName: 'SimplifyPDF',
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const tool = ALL_TOOLS[resolved.slug];
  if (!tool) notFound();

  // JSON-LD Structured Data Schema for Search Engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `SimplifyPDF ${tool.title}`,
        operatingSystem: 'All',
        applicationCategory: 'UtilitiesApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: tool.desc,
      },
      {
        '@type': 'HowTo',
        name: `How to ${tool.title} Online`,
        step: [
          {
            '@type': 'HowToStep',
            text: 'Drop or select your document in the SimplifyPDF uploader.',
          },
          {
            '@type': 'HowToStep',
            text: 'Choose your options and execute high-speed permissive processing.',
          },
          {
            '@type': 'HowToStep',
            text: 'Download your processed document instantly with signed URL.',
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
