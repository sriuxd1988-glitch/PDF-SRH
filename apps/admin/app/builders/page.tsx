'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutTemplate,
  Palette,
  FileText,
  Megaphone,
  Globe,
  Navigation,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';

export default function AdminBuildersOverviewPage() {
  const builders = [
    {
      title: 'Live Design Studio',
      href: '/design',
      desc: 'Real-time color tokens, typography scales, button shapes, and light/dark theme variables.',
      icon: Palette,
      badge: 'Hot Propagate',
    },
    {
      title: 'Homepage Builder',
      href: '/design',
      desc: 'Rearrange hero headlines, dropzone features, pricing matrices, and customer trust proofs.',
      icon: LayoutTemplate,
      badge: 'Blocks',
    },
    {
      title: 'Navigation & Header Builder',
      href: '/design',
      desc: 'Configure topbar menus, mega-menu tool categories, and primary action buttons.',
      icon: Navigation,
      badge: 'Header',
    },
    {
      title: 'Notification Bar Builder',
      href: '/design',
      desc: 'Broadcast sitewide promotional announcements, maintenance advisories, and discount coupons.',
      icon: Megaphone,
      badge: 'Banner',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="font-heading font-bold text- tracking-tight sm:text-3xl text-[var(--ink)]">
            Website Builders &amp; Customization
          </h1>
          <Badge variant="live">HEADLESS CMS</Badge>
        </div>
        <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
          Visual page and layout builders that publish instantly to PostgreSQL and Redis cache with zero server redeployments.
        </p>
      </div>

      {/* Builders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {builders.map((b, i) => {
          const Icon = b.icon;
          return (
            <Link
              key={i}
              href={b.href}
              className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--primary-500)] transition-all shadow-sm flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--soft)] text-[var(--muted)] border border-[var(--line)]">
                    {b.badge}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)] group-hover:text-[var(--primary-500)] transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-1">{b.desc}</p>
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-[var(--primary-500)]">
                <span>Configure in Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
