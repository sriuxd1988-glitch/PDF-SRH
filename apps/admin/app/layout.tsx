import React from 'react';
import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import '@simplifypdf/ui/styles/tokens.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'SimplifyPDF — Admin Dashboard & Design Studio',
  description: 'Manage tools, live design tokens, quotas, users, and builder layouts.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen font-body transition-colors">
        {children}
      </body>
    </html>
  );
}
