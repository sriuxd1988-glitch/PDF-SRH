'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Sliders,
  Users,
  CreditCard,
  Cpu,
  History,
  Palette,
  LayoutTemplate,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Zap,
  Globe,
  Bell,
  Search,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections = [
    {
      title: 'Operations',
      items: [
        { label: 'Executive Dashboard', href: '/', icon: Activity },
        { label: 'Tool Kill-Switches', href: '/tools', icon: Sliders },
        { label: 'Plans & Quotas', href: '/plans', icon: Zap },
        { label: 'User Management', href: '/users', icon: Users },
        { label: 'Billing & Subscriptions', href: '/billing', icon: CreditCard },
        { label: 'Queue & Worker Health', href: '/queue', icon: Cpu },
        { label: 'Audit Trail', href: '/audit', icon: History },
      ],
    },
    {
      title: 'Website Builders & Design',
      items: [
        { label: 'Live Design Studio', href: '/design', icon: Palette, highlight: true },
        { label: 'Website Builders', href: '/builders', icon: LayoutTemplate },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[var(--card)] border-r border-[var(--line)] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Bar */}
          <div className="h-16 px-6 border-b border-[var(--line)] flex items-center justify-between shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--primary-500)] text-white font-black text-base flex items-center justify-center">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-base text-[var(--ink)] leading-none">
                  SimplifyPDF
                </span>
                <span className="text-[10px] font-bold text-[var(--primary-500)] tracking-wider uppercase mt-0.5">
                  Admin HQ
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg border border-[var(--line)] text-[var(--muted)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 flex flex-col gap-6 flex-1">
            {navSections.map((sec) => (
              <div key={sec.title} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-3 mb-0.5">
                  {sec.title}
                </span>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[var(--primary-500)] text-white shadow-sm'
                          : 'text-[var(--text)] hover:bg-[var(--soft)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--muted)]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.highlight && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer Environment Tag */}
          <div className="p-4 border-t border-[var(--line)] shrink-0">
            <div className="p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[var(--ink)]">Production</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--muted)]">v2.4.0</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Administrative Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--card)]/90 backdrop-blur-md border-b border-[var(--line)] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[var(--line)] text-[var(--text)]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-[var(--muted)] hidden sm:inline">HQ</span>
            <span className="text-xs text-[var(--muted)] hidden sm:inline">/</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              {pathname === '/' ? 'Overview' : pathname.replace('/', '')}
            </span>
          </div>

          {/* Top Actions & Indicators */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-xs font-bold text-[var(--ink)] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--primary-500)]" />
              <span>View Public Website</span>
              <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
            </a>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Redis: 0 lag</span>
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-[var(--line)]">
              <div className="w-8 h-8 rounded-full bg-[var(--secondary)] text-white text-xs font-bold flex items-center justify-center">
                SA
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-[var(--ink)] leading-none">Super Admin</span>
                <span className="block text-[10px] text-emerald-600 font-bold mt-0.5">Full Privileges</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
