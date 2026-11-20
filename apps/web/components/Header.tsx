'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sun,
  Moon,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Combine,
  Scissors,
  Lock,
  Unlock,
  EyeOff,
  FilePenLine,
  Minimize2,
  Trash2,
  RotateCw,
  Layers,
  Wrench,
  ScanText,
  FolderTree,
  Stamp,
  Crop,
  Hash,
  Share2,
  CheckSquare,
  FileCheck,
  FileCode,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [openMenu, setOpenMenu] = useState<'convert' | 'all' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleMouseEnter = (menu: 'convert' | 'all') => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setOpenMenu(menu);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#14141c] border-b border-[#e2e8f0] dark:border-[#242430] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-500)] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex items-baseline">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-[#181b20] dark:text-white">
                Simplify<span className="text-[var(--primary-500)]">PDF</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (iLovePDF Style) */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold uppercase tracking-wider text-[#181b20] dark:text-neutral-200">
            <Link
              href="/tools/merge"
              className="py-2 hover:text-[var(--primary-500)] transition-colors whitespace-nowrap"
            >
              Merge PDF
            </Link>

            <Link
              href="/tools/split"
              className="py-2 hover:text-[var(--primary-500)] transition-colors whitespace-nowrap"
            >
              Split PDF
            </Link>

            <Link
              href="/tools/compress"
              className="py-2 hover:text-[var(--primary-500)] transition-colors whitespace-nowrap"
            >
              Compress PDF
            </Link>

            {/* Convert PDF Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('convert')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'convert' ? null : 'convert')}
                className={`flex items-center gap-1 py-2 hover:text-[var(--primary-500)] transition-colors ${
                  openMenu === 'convert' ? 'text-[var(--primary-500)]' : ''
                }`}
              >
                <span>Convert PDF</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === 'convert' ? 'rotate-180' : ''}`} />
              </button>

              {openMenu === 'convert' && (
                <div className="absolute top-full left-0 w-[480px] bg-white dark:bg-[#181824] rounded-2xl shadow-2xl border border-[#e2e8f0] dark:border-[#2a2a38] p-6 grid grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-150">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] mb-3">
                      Convert to PDF
                    </h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/tools/jpg-to-pdf" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#F59E0B] text-white flex items-center justify-center text-[10px]"><ImageIcon className="w-3 h-3" /></span>
                        JPG to PDF
                      </Link>
                      <Link href="/tools/word-to-pdf" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#185ABD] text-white flex items-center justify-center text-[10px] font-bold">W</span>
                        Word to PDF
                      </Link>
                      <Link href="/tools/powerpoint-to-pdf" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#D83B01] text-white flex items-center justify-center text-[10px] font-bold">P</span>
                        PowerPoint to PDF
                      </Link>
                      <Link href="/tools/excel-to-pdf" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#107C41] text-white flex items-center justify-center text-[10px] font-bold">X</span>
                        Excel to PDF
                      </Link>
                      <Link href="/tools/html-to-pdf" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#0288D1] text-white flex items-center justify-center text-[10px]"><FileCode className="w-3 h-3" /></span>
                        HTML to PDF
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] mb-3">
                      Convert from PDF
                    </h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/tools/pdf-to-jpg" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#F59E0B] text-white flex items-center justify-center text-[10px]"><ImageIcon className="w-3 h-3" /></span>
                        PDF to JPG
                      </Link>
                      <Link href="/tools/pdf-to-word" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#185ABD] text-white flex items-center justify-center text-[10px] font-bold">W</span>
                        PDF to Word
                      </Link>
                      <Link href="/tools/pdf-to-powerpoint" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#D83B01] text-white flex items-center justify-center text-[10px] font-bold">P</span>
                        PDF to PowerPoint
                      </Link>
                      <Link href="/tools/pdf-to-excel" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#107C41] text-white flex items-center justify-center text-[10px] font-bold">X</span>
                        PDF to Excel
                      </Link>
                      <Link href="/tools/pdf-to-pdfa" className="flex items-center gap-2.5 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)] p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                        <span className="w-5 h-5 rounded bg-[#E53935] text-white flex items-center justify-center text-[9px] font-bold">/A</span>
                        PDF to PDF/A
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* All PDF Tools Mega-Menu (iLovePDF Style) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('all')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'all' ? null : 'all')}
                className={`flex items-center gap-1.5 py-2 hover:text-[var(--primary-500)] transition-colors ${
                  openMenu === 'all' ? 'text-[var(--primary-500)]' : ''
                }`}
              >
                <span>All PDF Tools</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-500)] dark:bg-purple-950/60 dark:text-purple-300">
                  58
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === 'all' ? 'rotate-180' : ''}`} />
              </button>

              {openMenu === 'all' && (
                <div className="fixed left-4 right-4 top-18 max-w-7xl mx-auto bg-white dark:bg-[#181824] rounded-2xl shadow-2xl border border-[#e2e8f0] dark:border-[#2a2a38] p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-in fade-in zoom-in-95 duration-150 z-50">
                  {/* Column 1: Organize PDF */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] mb-3">
                      Organize PDF
                    </h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/tools/merge" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#EA580C] text-white flex items-center justify-center"><Combine className="w-3 h-3" /></span>
                        Merge PDF
                      </Link>
                      <Link href="/tools/split" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#EA580C] text-white flex items-center justify-center"><Scissors className="w-3 h-3" /></span>
                        Split PDF
                      </Link>
                      <Link href="/tools/delete-pages" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#7C3AED] text-white flex items-center justify-center"><Trash2 className="w-3 h-3" /></span>
                        Remove pages
                      </Link>
                      <Link href="/tools/extract-pages" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#7C3AED] text-white flex items-center justify-center"><Layers className="w-3 h-3" /></span>
                        Extract pages
                      </Link>
                      <Link href="/tools/organize" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#7C3AED] text-white flex items-center justify-center"><FolderTree className="w-3 h-3" /></span>
                        Organize PDF
                      </Link>
                    </div>
                  </div>

                  {/* Column 2: Optimize PDF */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] mb-3">
                      Optimize PDF
                    </h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/tools/compress" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#10B981] text-white flex items-center justify-center"><Minimize2 className="w-3 h-3" /></span>
                        Compress PDF
                      </Link>
                      <Link href="/tools/repair" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#E53935] text-white flex items-center justify-center"><Wrench className="w-3 h-3" /></span>
                        Repair PDF
                      </Link>
                      <Link href="/tools/ocr" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#E53935] text-white flex items-center justify-center"><ScanText className="w-3 h-3" /></span>
                        OCR PDF
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: Convert to PDF */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] mb-3">
                      Convert to PDF
                    </h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/tools/jpg-to-pdf" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#F59E0B] text-white flex items-center justify-center"><ImageIcon className="w-3 h-3" /></span>
                        JPG to PDF
                      </Link>
                      <Link href="/tools/word-to-pdf" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#185ABD] text-white flex items-center justify-center text-[10px] font-bold">W</span>
                        WORD to PDF
                      </Link>
                      <Link href="/tools/powerpoint-to-pdf" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#D83B01] text-white flex items-center justify-center text-[10px] font-bold">P</span>
                        POWERPOINT to PDF
                      </Link>
                      <Link href="/tools/excel-to-pdf" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#107C41] text-white flex items-center justify-center text-[10px] font-bold">X</span>
                        EXCEL to PDF
                      </Link>
                      <Link href="/tools/html-to-pdf" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#0288D1] text-white flex items-center justify-center"><FileCode className="w-3 h-3" /></span>
                        HTML to PDF
                      </Link>
                    </div>
                  </div>

                  {/* Column 4: Convert from PDF */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] mb-3">
                      Convert from PDF
                    </h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/tools/pdf-to-jpg" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#F59E0B] text-white flex items-center justify-center"><ImageIcon className="w-3 h-3" /></span>
                        PDF to JPG
                      </Link>
                      <Link href="/tools/pdf-to-word" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#185ABD] text-white flex items-center justify-center text-[10px] font-bold">W</span>
                        PDF to WORD
                      </Link>
                      <Link href="/tools/pdf-to-powerpoint" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#D83B01] text-white flex items-center justify-center text-[10px] font-bold">P</span>
                        PDF to POWERPOINT
                      </Link>
                      <Link href="/tools/pdf-to-excel" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#107C41] text-white flex items-center justify-center text-[10px] font-bold">X</span>
                        PDF to EXCEL
                      </Link>
                      <Link href="/tools/pdf-to-pdfa" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#E53935] text-white flex items-center justify-center text-[9px] font-bold">/A</span>
                        PDF to PDF/A
                      </Link>
                    </div>
                  </div>

                  {/* Column 5: Edit PDF */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] mb-3">
                      Edit PDF
                    </h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/tools/rotate" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#7C3AED] text-white flex items-center justify-center"><RotateCw className="w-3 h-3" /></span>
                        Rotate PDF
                      </Link>
                      <Link href="/tools/number-pages" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#0D9488] text-white flex items-center justify-center"><Hash className="w-3 h-3" /></span>
                        Add page numbers
                      </Link>
                      <Link href="/tools/watermark" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#0D9488] text-white flex items-center justify-center"><Stamp className="w-3 h-3" /></span>
                        Add watermark
                      </Link>
                      <Link href="/tools/crop" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#0D9488] text-white flex items-center justify-center"><Crop className="w-3 h-3" /></span>
                        Crop PDF
                      </Link>
                      <Link href="/tools/edit-pdf" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#0D9488] text-white flex items-center justify-center"><FileText className="w-3 h-3" /></span>
                        Edit PDF
                      </Link>
                      <Link href="/tools/form-filler" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#0D9488] text-white flex items-center justify-center"><CheckSquare className="w-3 h-3" /></span>
                        PDF Forms
                      </Link>
                    </div>
                  </div>

                  {/* Column 6: PDF Security */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] mb-3">
                      PDF Security
                    </h4>
                    <div className="flex flex-col gap-2">
                      <Link href="/tools/unlock" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#0D9488] text-white flex items-center justify-center"><Unlock className="w-3 h-3" /></span>
                        Unlock PDF
                      </Link>
                      <Link href="/tools/protect" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#0D9488] text-white flex items-center justify-center"><Lock className="w-3 h-3" /></span>
                        Protect PDF
                      </Link>
                      <Link href="/tools/esign" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#E91E63] text-white flex items-center justify-center"><FilePenLine className="w-3 h-3" /></span>
                        Sign PDF
                      </Link>
                      <Link href="/tools/redact" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#0D9488] text-white flex items-center justify-center"><EyeOff className="w-3 h-3" /></span>
                        Redact PDF
                      </Link>
                      <Link href="/tools/flatten" className="flex items-center gap-2 text-xs font-semibold text-[#181b20] dark:text-neutral-200 hover:text-[var(--primary-500)]">
                        <span className="w-5 h-5 rounded bg-[#F43F5E] text-white flex items-center justify-center"><Layers className="w-3 h-3" /></span>
                        Flatten PDF
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-full border border-[#e2e8f0] dark:border-[#242430] text-[#64748b] hover:text-[#181b20] dark:hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <Link
            href="/login"
            className="hidden sm:inline-block text-sm font-bold text-[#181b20] dark:text-white hover:text-[var(--primary-500)] transition-colors px-2 py-1"
          >
            Log in
          </Link>

          <Link
            href="/pricing"
            className="hidden sm:inline-block px-5 py-2.5 rounded-full bg-[var(--primary-500)] hover:bg-[var(--primary-700)] text-white hover:text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Sign up
          </Link>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2.5 rounded-full border border-[#e2e8f0] dark:border-[#242430] text-[#64748b] hover:text-[#181b20] dark:hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e2e8f0] dark:border-[#242430] bg-white dark:bg-[#14141c] px-4 py-6 flex flex-col gap-5 animate-in slide-in-from-top-2 duration-200 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
            <span>Popular PDF Tools</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-500)] font-extrabold">
              58 Tools Total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider text-[#181b20] dark:text-neutral-200">
            <Link
              href="/tools/merge"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[var(--soft)] hover:bg-[var(--line)] flex items-center gap-2 transition-colors"
            >
              <span className="w-6 h-6 rounded bg-[#EA580C] text-white flex items-center justify-center shrink-0">
                <Combine className="w-3.5 h-3.5" />
              </span>
              <span className="truncate">Merge PDF</span>
            </Link>

            <Link
              href="/tools/split"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[var(--soft)] hover:bg-[var(--line)] flex items-center gap-2 transition-colors"
            >
              <span className="w-6 h-6 rounded bg-[#EA580C] text-white flex items-center justify-center shrink-0">
                <Scissors className="w-3.5 h-3.5" />
              </span>
              <span className="truncate">Split PDF</span>
            </Link>

            <Link
              href="/tools/compress"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[var(--soft)] hover:bg-[var(--line)] flex items-center gap-2 transition-colors"
            >
              <span className="w-6 h-6 rounded bg-[#10B981] text-white flex items-center justify-center shrink-0">
                <Minimize2 className="w-3.5 h-3.5" />
              </span>
              <span className="truncate">Compress PDF</span>
            </Link>

            <Link
              href="/tools/pdf-to-word"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[var(--soft)] hover:bg-[var(--line)] flex items-center gap-2 transition-colors"
            >
              <span className="w-6 h-6 rounded bg-[#185ABD] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                W
              </span>
              <span className="truncate">PDF to Word</span>
            </Link>

            <Link
              href="/tools/word-to-pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[var(--soft)] hover:bg-[var(--line)] flex items-center gap-2 transition-colors"
            >
              <span className="w-6 h-6 rounded bg-[#185ABD] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                W
              </span>
              <span className="truncate">Word to PDF</span>
            </Link>

            <Link
              href="/tools/protect"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[var(--soft)] hover:bg-[var(--line)] flex items-center gap-2 transition-colors"
            >
              <span className="w-6 h-6 rounded bg-[#0D9488] text-white flex items-center justify-center shrink-0">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <span className="truncate">Protect PDF</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#e2e8f0] dark:border-[#242430] flex flex-col gap-2">
            <Link
              href="/#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-wider text-[var(--primary-500)] py-2 flex items-center justify-between"
            >
              <span>Explore All 58 PDF Tools</span>
              <span>→</span>
            </Link>

            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-wider text-[#181b20] dark:text-white py-2 flex items-center justify-between"
            >
              <span>Pricing Plans</span>
              <span className="text-[10px] font-normal text-[var(--muted)]">Pro $4.99/mo</span>
            </Link>

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-wider text-[#181b20] dark:text-white py-2"
            >
              Blog & PDF Guides
            </Link>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-full border border-[#e2e8f0] dark:border-[#242430] text-xs font-bold text-[#181b20] dark:text-white hover:bg-[var(--soft)] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-3 text-center rounded-full bg-[var(--primary-500)] hover:bg-[var(--primary-700)] text-white text-xs font-bold shadow-sm transition-colors"
            >
              Sign up Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
