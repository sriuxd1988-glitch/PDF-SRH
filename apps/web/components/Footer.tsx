import React from 'react';
import Link from 'next/link';

export function Footer() {
  const columns = [
    {
      title: 'Optimize & Edit',
      links: [
        { label: 'Compress PDF', href: '/tools/compress' },
        { label: 'Merge PDF', href: '/tools/merge' },
        { label: 'Split PDF', href: '/tools/split' },
        { label: 'Organize Pages', href: '/tools/organize' },
        { label: 'Rotate PDF', href: '/tools/rotate' },
      ],
    },
    {
      title: 'Convert to PDF',
      links: [
        { label: 'Word to PDF', href: '/tools/word-to-pdf' },
        { label: 'JPG to PDF', href: '/tools/images-to-pdf' },
        { label: 'Excel to PDF', href: '/tools/excel-to-pdf' },
        { label: 'PowerPoint to PDF', href: '/tools/powerpoint-to-pdf' },
      ],
    },
    {
      title: 'Convert from PDF',
      links: [
        { label: 'PDF to Word', href: '/tools/pdf-to-word' },
        { label: 'PDF to JPG', href: '/tools/pdf-to-images' },
        { label: 'PDF to Text (OCR)', href: '/tools/ocr' },
      ],
    },
    {
      title: 'Security & Legal',
      links: [
        { label: 'Protect PDF', href: '/tools/protect' },
        { label: 'Unlock PDF', href: '/tools/unlock' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[var(--ink)] text-white/80 pt-16 pb-12 border-t border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {columns.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-white/70 hover:text-white hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2026 SimplifyPDF. All rights reserved. Zero tracking. Automatic file shredding.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
            <span className="text-[var(--lime)] font-mono font-bold">100% Permissive Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
