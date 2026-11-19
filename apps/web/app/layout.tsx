import React from 'react';
import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import '@simplifypdf/ui/styles/tokens.css';
import './globals.css';
import { NotificationBar } from '../components/NotificationBar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'SimplifyPDF — High-Speed, Permissive Open-Source PDF Platform',
  description: 'Compress, merge, split, convert, and sign PDF documents directly in your browser. Powered by 100% permissive open-source engines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen flex flex-col font-body transition-colors">
        <NotificationBar />
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
