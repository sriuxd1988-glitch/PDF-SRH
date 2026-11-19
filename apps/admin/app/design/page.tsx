'use client';

import React from 'react';
import { Palette, Sparkles, ExternalLink } from 'lucide-react';
import { Badge } from '@simplifypdf/ui';
import { DesignStudio } from '../../components/DesignStudio';

export default function AdminDesignPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text- tracking-tight sm:text-3xl text-[var(--ink)]">
              Live Design System Studio
            </h1>
            <Badge variant="live" dot>HOT PROPAGATION</Badge>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
            Manipulate CSS tokens (Primary `#864FFE`, Secondary `#1A1A1C`, Accents, Border Radius). Every edit instantly broadcasts across open browser windows and iframes via BroadcastChannel, updating the public website and user portals in real time.
          </p>
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] transition-all inline-flex items-center gap-2 shadow-sm"
        >
          <span>Open Public Website in New Tab</span>
          <ExternalLink className="w-3.5 h-3.5 text-white" />
        </a>
      </div>

      {/* Main Studio Component */}
      <DesignStudio />
    </div>
  );
}
