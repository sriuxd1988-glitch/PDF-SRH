import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge, GlowCard } from '@simplifypdf/ui';

export const metadata = {
  title: 'Blog & PDF Guides — SimplifyPDF',
  description: 'Expert guides, security best practices, and document workflow optimizations from the SimplifyPDF engineering team.',
};

const POSTS = [
  {
    slug: 'how-to-compress-pdf-without-losing-quality',
    title: 'How to Compress Large PDFs by 80% Without Losing Image Quality',
    excerpt: 'Discover how stream linearization and adaptive 150 DPI downsampling preserve crisp vector text while drastically slashing document size.',
    category: 'PDF Guides',
    date: 'Nov 18, 2026',
    readTime: '4 min read',
    author: 'Elena Vance, Lead Systems Engineer',
  },
  {
    slug: 'why-permissive-open-source-pdf-matters',
    title: 'Why Permissive Open-Source Engines Beat AGPL Competitors',
    excerpt: 'Understanding the commercial and legal implications of AGPL v3 libraries like Ghostscript and PyMuPDF versus Apache 2.0 pypdfium2.',
    category: 'Security & Privacy',
    date: 'Nov 14, 2026',
    readTime: '6 min read',
    author: 'Devon Patel, Security Architect',
  },
  {
    slug: 'complete-guide-to-pdf-redaction',
    title: 'True Redaction vs Black Highlighting: Protecting Sensitive Data',
    excerpt: 'Why black rectangle annotations fail to protect confidential data, and how irreversible content stream sanitization works.',
    category: 'Productivity',
    date: 'Nov 10, 2026',
    readTime: '5 min read',
    author: 'Elena Vance, Lead Systems Engineer',
  },
];

export default function BlogListingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 flex flex-col gap-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
        <Badge variant="pro">DOCUMENT ENGINEERING INSIGHTS</Badge>
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-[var(--ink)] tracking-tight">
          SimplifyPDF Blog & Guides
        </h1>
        <p className="text-base text-[var(--muted)]">
          Practical tutorials, architecture breakdowns, and security deep-dives from our engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <GlowCard className="p-6 h-full flex flex-col justify-between group-hover:border-[var(--primary-500)] transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] mb-3">
                  <span className="text-[var(--primary-500)] uppercase tracking-wider">{post.category}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h2 className="font-heading font-black text-xl text-[var(--ink)] group-hover:text-[var(--primary-500)] transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
                <span className="text-[var(--muted)] font-semibold">{post.author}</span>
                <span className="font-bold text-[var(--primary-500)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </GlowCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
