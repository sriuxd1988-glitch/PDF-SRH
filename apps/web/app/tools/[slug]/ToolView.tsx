'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DropZone } from '../../../components/DropZone';
import { getToolContent, ToolSEOContent, ToolFeature } from '../../../lib/tool-content';
import {
  ShieldCheck,
  Zap,
  Cloud,
  Lock,
  Laptop,
  Sparkles,
  Star,
  ChevronDown,
  Clock,
  ArrowRight,
  FileText,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface ToolViewProps {
  slug: string;
  tool: {
    title: string;
    toolType: string;
    desc: string;
    maxMb: number;
    tips: string[];
  };
}

export function ToolView({ slug, tool }: ToolViewProps) {
  const content = getToolContent(slug, tool);

  // Interactive FAQ accordion state (first open by default)
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Rating Widget state
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);

  const handleRate = (stars: number) => {
    setUserRating(stars);
    setHasRated(true);
  };

  const renderFeatureIcon = (type: ToolFeature['iconType']) => {
    switch (type) {
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'lock':
        return <Lock className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />;
      case 'cloud':
        return <Cloud className="w-5 h-5 text-purple-500 shrink-0" />;
      case 'device':
        return <Laptop className="w-5 h-5 text-indigo-500 shrink-0" />;
      case 'quality':
      default:
        return <Sparkles className="w-5 h-5 text-[var(--primary-500)] shrink-0" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-16 py-8 sm:py-12">
      {/* ---------------- BREADCRUMBS & HERO AREA ---------------- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full flex flex-col items-center text-center gap-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
          <Link href="/" className="hover:text-[var(--ink)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/#tools" className="hover:text-[var(--ink)] transition-colors">
            PDF Tools
          </Link>
          <span>/</span>
          <span className="text-[var(--ink)] font-semibold">{tool.title}</span>
        </nav>

        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-[var(--ink)] tracking-tight">
          {tool.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--muted)] font-normal max-w-2xl leading-relaxed">
          {tool.desc}
        </p>
      </div>

      {/* ---------------- CHOOSE FILE WIDGET BOX (No settings clutter) ---------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <DropZone
          slug={slug}
          toolType={tool.toolType}
          toolTitle={tool.title}
          maxFileSizeMb={tool.maxMb}
        />
      </section>

      {/* ---------------- SECTION 1: HOW TO [ACTION] ONLINE FOR FREE ---------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full pt-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-500)] bg-[var(--primary-50)] px-3 py-1 rounded-full">
            Quick 4-Step Tutorial
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mt-3">
            {content.actionTitle}:
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] mt-2">
            Follow these straightforward steps to {content.shortVerb.toLowerCase()} your {content.noun} in seconds.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.howToSteps.map((s) => (
            <div
              key={s.step}
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-sm hover:shadow-md hover:border-[var(--primary-300)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] text-[var(--primary-500)] font-heading font-bold text-lg flex items-center justify-center mb-4">
                  {s.step}
                </div>
                <h3 className="font-heading font-semibold text-base text-[var(--ink)] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* App Preview Mockup Strip */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[var(--primary-50)]/60 via-purple-50/40 to-[var(--soft)] border border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-500)] text-white flex items-center justify-center shadow-lg shadow-purple-500/25 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-[var(--ink)]">
                Permissive Open-Source Performance
              </h4>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-0.5">
                Powered by pypdfium2, pikepdf, and qpdf for maximum rendering fidelity without AGPL constraints.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-black/30 border border-[var(--line)] text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> ClamAV Virus Scanned
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-black/30 border border-[var(--line)] text-xs font-semibold text-purple-600 dark:text-purple-400">
              <Lock className="w-3.5 h-3.5" /> 2h Auto-Shred
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 2: RATING & SOCIAL PROOF STRIP ---------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRate(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                  title={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      (userRating ?? 5) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">
                {hasRated ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Thank you! Rated {userRating}/5 stars.
                  </span>
                ) : (
                  `Rate this tool · ${content.ratingScore} / 5`
                )}
              </p>
              <p className="text-xs text-[var(--muted)]">
                Based on {content.ratingVotes} community ratings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--muted)]">Share this tool:</span>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: tool.title,
                    text: tool.desc,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Tool link copied to clipboard!');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-xs font-semibold text-[var(--ink)] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 3: 6-ITEM FEATURES & WHY USE GRID ---------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-500)] bg-[var(--primary-50)] px-3 py-1 rounded-full">
            Why Choose SimplifyPDF
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mt-3">
            Everything You Need to {content.shortVerb} Like a Pro:
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] mt-2">
            Engineered for unmatched speed, privacy, and cross-platform compatibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-sm hover:shadow-md hover:border-[var(--primary-300)] transition-all flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--soft)] flex items-center justify-center">
                {renderFeatureIcon(feat.iconType)}
              </div>
              <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 4: FREQUENTLY ASKED QUESTIONS (ACCORDION) ---------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-500)] bg-[var(--primary-50)] px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mt-3">
            {tool.title} FAQs:
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] mt-2">
            Answers to common questions about using our free online {tool.title.toLowerCase()} tool.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {content.faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[var(--line)] bg-[var(--card)] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-sm sm:text-base text-[var(--ink)] hover:text-[var(--primary-500)] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--muted)] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[var(--primary-500)]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--line)]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- SECTION 5: BLOG ARTICLES & GUIDES ---------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-500)] bg-[var(--primary-50)] px-3 py-1 rounded-full">
            Knowledge Base
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mt-3">
            {tool.title} Blog Articles & Guides:
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] mt-2">
            In-depth tutorials, privacy best practices, and document workflow tips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.articles.map((art, idx) => (
            <Link
              key={idx}
              href={`/blog/${art.slug}`}
              className="group p-6 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-sm hover:shadow-md hover:border-[var(--primary-400)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-3">
                  <span className="font-semibold text-[var(--primary-500)] uppercase tracking-wider">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3 className="font-heading font-semibold text-base text-[var(--ink)] group-hover:text-[var(--primary-500)] transition-colors mb-2">
                  {art.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center text-xs font-semibold text-[var(--primary-500)] group-hover:translate-x-1 transition-transform">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 6: RELATED TOOLS DIRECTORY ---------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full pb-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="font-heading font-bold text-2xl text-[var(--ink)] tracking-tight">
            More PDF Tools You Might Like:
          </h3>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Complementary tools to enhance your document productivity.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {content.relatedSlugs.map((relSlug) => {
            const relTitle = relSlug
              .split('-')
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(' ');
            return (
              <Link
                key={relSlug}
                href={`/tools/${relSlug}`}
                className="p-4 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--primary-400)] hover:shadow-sm text-center transition-all flex flex-col items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[var(--ink)] group-hover:text-[var(--primary-500)] transition-colors truncate w-full">
                  {relTitle}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
