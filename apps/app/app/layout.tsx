import React from 'react';
import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import '@simplifypdf/ui/styles/tokens.css';
import './globals.css';
import { DashboardShell } from '../components/DashboardShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'SimplifyPDF — User Workspace',
  description: 'Manage PDF documents, quotas, and batch processing.',
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen font-body transition-colors">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
