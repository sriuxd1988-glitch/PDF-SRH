'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, ArrowRight, ShieldCheck } from 'lucide-react';
import { ButtonV6, NextSaaSBtn, Badge } from '@simplifypdf/ui';

interface HeaderProps {
  logoText?: string;
  navItems?: Array<{ label: string; href: string; badge?: string }>;
  ctaText?: string;
  ctaLink?: string;
}

export function Header({
  logoText = 'SimplifyPDF',
  navItems = [
    { label: 'All Tools', href: '/#tools', badge: '40+' },
    { label: 'Compress', href: '/tools/compress' },
    { label: 'Merge', href: '/tools/merge' },
    { label: 'Convert', href: '/tools/word-to-pdf' },
    { label: 'Pricing', href: '/pricing' },
  ],
  ctaText = 'Get Started',
  ctaLink = '/tools/compress',
}: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--bg)]/90 border-b border-[var(--line)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-500)] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-xl tracking-tight text-[var(--ink)]">
              {logoText}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Permissive OS
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors flex items-center gap-1.5"
            >
              {item.label}
              {item.badge && (
                <Badge variant="pro" className="text-[10px] px-1.5 py-0.5">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors shadow-sm"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <Link href="/login" className="hidden sm:inline-block text-sm font-bold text-[var(--ink)] hover:text-[var(--primary-500)] transition-colors px-3 py-2">
            Sign In
          </Link>

          {/* NextSaaS .btn-v6 vertical rolling text flip button with pure white text */}
          <Link href={ctaLink}>
            <ButtonV6
              text={ctaText}
              hoverText="Go Faster →"
              variant="primary"
              size="md"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
