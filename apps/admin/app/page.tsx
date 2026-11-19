'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Palette,
  Sliders,
  Users,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Server,
  ExternalLink,
} from 'lucide-react';
import { DesignStudio } from '../components/DesignStudio';
import { ToolControls } from '../components/ToolControls';
import { Badge } from '@simplifypdf/ui';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'DESIGN' | 'TOOLS' | 'OVERVIEW' | 'USERS'>('DESIGN');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Admin Header */}
      <header className="border-b border-[var(--line)] bg-[var(--card)] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-500)] text-white font-black text-lg flex items-center justify-center">
              S
            </div>
            <span className="font-heading font-black text-lg text-[var(--ink)]">
              SimplifyPDF Admin
            </span>
          </div>
          <span className="text-xs text-[var(--muted)]">/</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
            Command Center
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--primary-500)] transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Redis Streams: 0 lag</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[var(--secondary)] text-white text-xs font-bold flex items-center justify-center">
            SA
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('DESIGN')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'DESIGN'
                ? 'bg-[var(--primary-500)] text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Palette className="w-4 h-4 text-white" />
            <span>Live Design System Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('TOOLS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'TOOLS'
                ? 'bg-[var(--primary-500)] text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Tool Controls & Circuit Breakers</span>
          </button>

          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'bg-[var(--primary-500)] text-white shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System Health & KPIs</span>
          </button>
        </div>

        {/* Tab 1: Live Design Studio */}
        {activeTab === 'DESIGN' && <DesignStudio />}

        {/* Tab 2: Tool Circuit Breakers */}
        {activeTab === 'TOOLS' && <ToolControls />}

        {/* Tab 3: System Health & Overview */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                Jobs Processed (24h)
              </span>
              <div className="font-heading font-black text-3xl text-[var(--ink)] mt-2">1,482</div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
                ↑ 14% vs yesterday
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                Active Pro Subscriptions
              </span>
              <div className="font-heading font-black text-3xl text-[var(--ink)] mt-2">128</div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
                ₹63,872 MRR
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                VPS Memory Usage
              </span>
              <div className="font-heading font-black text-3xl text-[var(--ink)] mt-2">58%</div>
              <span className="text-xs text-[var(--muted)] font-semibold mt-1 inline-block">
                LibreOffice Semaphore = 1
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                MinIO S3 Retention
              </span>
              <div className="font-heading font-black text-3xl text-[var(--ink)] mt-2">Clean</div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
                0 orphaned objects
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
