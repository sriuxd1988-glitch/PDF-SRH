'use client';

import React, { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layers,
  FolderArchive,
  Clock,
  CreditCard,
  Settings,
  Sparkles,
  Zap,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { ButtonV6, Badge } from '@simplifypdf/ui';
import { UpgradeModal } from './UpgradeModal';

interface AppContextType {
  userRole: 'FREE' | 'PRO';
  setUserRole: (role: 'FREE' | 'PRO') => void;
  openUpgradeModal: (reason?: string) => void;
}

const AppContext = createContext<AppContextType>({
  userRole: 'FREE',
  setUserRole: () => {},
  openUpgradeModal: () => {},
});

export const useApp = () => useContext(AppContext);

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<'FREE' | 'PRO'>('FREE');
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openUpgradeModal = (reason?: string) => {
    setUpgradeReason(reason);
    setIsUpgradeOpen(true);
  };

  const navItems = [
    { label: 'Workspace', href: '/', icon: Layers },
    { label: 'History Vault', href: '/files', icon: Clock },
    { label: 'Batch ZIP Studio', href: '/batch', icon: FolderArchive, proOnly: true },
    { label: 'Billing & Plans', href: '/billing', icon: CreditCard },
    { label: 'Account & Security', href: '/settings', icon: Settings },
  ];

  return (
    <AppContext.Provider value={{ userRole, setUserRole, openUpgradeModal }}>
      <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors">
        {/* Mobile Sidebar Backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[var(--card)] border-r border-[var(--line)] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="h-16 px-6 border-b border-[var(--line)] flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--primary-500)] text-white font-bold text-sm flex items-center justify-center">
                  S
                </div>
                <span className="font-heading font-bold text-base tracking-tight text-[var(--ink)]">SimplifyPDF</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-lg border border-[var(--line)] text-[var(--muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="p-4 flex flex-col gap-1.5 flex-1 overflow-y-auto">
              <div className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider px-3 mb-1">
                Navigation
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[var(--primary-500)] text-white shadow-sm font-semibold'
                        : 'text-[var(--text)] hover:bg-[var(--soft)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--muted)]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.proOnly && userRole === 'FREE' && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--yellow)] text-neutral-950">
                        PRO
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Upgrade Card */}
            {userRole === 'FREE' ? (
              <div className="p-4 border-t border-[var(--line)]">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--primary-50)] to-violet-100/50 dark:from-[var(--soft)] dark:to-violet-950/20 border border-[var(--line)] flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--primary-500)]" />
                    <span className="text-xs font-semibold text-[var(--ink)]">Unlock PRO 2GB</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] font-normal">
                    Batch ZIP conversion, 24h retention, and priority worker queue.
                  </p>
                  <button
                    onClick={() => openUpgradeModal('Upgrade from free sidebar.')}
                    className="w-full py-2 rounded-xl bg-[var(--primary-500)] text-white font-medium text-xs hover:bg-[var(--primary-700)] transition-colors shadow-sm"
                  >
                    Upgrade for ₹249/mo
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-[var(--line)]">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-emerald-600 truncate">Priority Worker Routing</span>
                    <span className="block text-[10px] text-[var(--muted)] font-normal">Zero Queue Delay</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* Header */}
          <header className="sticky top-0 z-30 h-16 bg-[var(--card)]/90 backdrop-blur-md border-b border-[var(--line)] px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-[var(--line)] text-[var(--text)]"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-[var(--muted)] hidden sm:inline">User Portal</span>
              <span className="text-xs text-[var(--muted)] hidden sm:inline">/</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                {pathname === '/' ? 'Workspace' : pathname.replace('/', '')}
              </span>
            </div>

            {/* Role Switcher & User Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Role Toggle for Live Verification */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--soft)] border border-[var(--line)] text-xs font-bold">
                <button
                  onClick={() => setUserRole('FREE')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    userRole === 'FREE' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
                  }`}
                >
                  Free (50MB)
                </button>
                <button
                  onClick={() => setUserRole('PRO')}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                    userRole === 'PRO' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
                  }`}
                >
                  <span>PRO (2GB)</span>
                  <span className="w-2 h-2 rounded-full bg-[var(--lime)] inline-block" />
                </button>
              </div>

              {/* Upgrade Button if Free */}
              {userRole === 'FREE' && (
                <div onClick={() => openUpgradeModal('Direct header upgrade CTA')}>
                  <ButtonV6 text="Upgrade to Pro" hoverText="Get 2GB Quota" variant="primary" size="sm" />
                </div>
              )}

              {/* User Avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-[var(--line)]">
                <div className="w-8 h-8 rounded-full bg-[var(--primary-500)] text-white text-xs font-bold flex items-center justify-center">
                  JD
                </div>
                <div className="hidden md:block text-left">
                  <span className="block text-xs font-bold text-[var(--ink)] leading-none">John Doe</span>
                  <span className="block text-[10px] text-[var(--muted)] mt-0.5">{userRole === 'PRO' ? 'Pro Member' : 'Free Member'}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Global Upgrade Modal */}
        <UpgradeModal
          isOpen={isUpgradeOpen}
          onClose={() => setIsUpgradeOpen(false)}
          triggerReason={upgradeReason}
        />
      </div>
    </AppContext.Provider>
  );
}
