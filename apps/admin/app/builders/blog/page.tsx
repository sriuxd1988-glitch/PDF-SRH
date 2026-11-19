'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Calendar,
  Share2,
  Image,
  Globe,
  Sparkles,
  Search,
} from 'lucide-react';
import { BuilderEngine } from '../../../components/builder/BuilderEngine';

interface BlogPostDraft {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  excerpt: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  publishedAt: string;
  content: string;
}

export default function BlogBuilderPage() {
  const [posts, setPosts] = useState<BlogPostDraft[]>([
    {
      id: 'b-1',
      slug: 'how-to-compress-pdf-without-losing-quality',
      title: 'How to Compress PDF Without Losing Quality (2025 Guide)',
      category: 'PDF Guides',
      author: 'Technical Team',
      excerpt: 'Learn the exact techniques behind DPI downsampling, JBIG2 compression, and stream deduplication.',
      status: 'PUBLISHED',
      publishedAt: 'Nov 14, 2025',
      content: '## Executive Summary\n\nPDF file size reduction is crucial for email attachments and portals...',
    },
    {
      id: 'b-2',
      slug: 'why-permissive-open-source-pdf-matters',
      title: 'Why Permissive Open-Source PDF Engines Matter for Businesses',
      category: 'Security & Privacy',
      author: 'Compliance Lead',
      excerpt: 'How ghostscript and AGPL viral licenses create corporate exposure, and why pikepdf & pypdfium2 protect you.',
      status: 'PUBLISHED',
      publishedAt: 'Nov 10, 2025',
      content: '## The AGPL Trap\n\nMany modern SaaS tools rely on PyMuPDF without disclosing AGPL viral clauses...',
    },
    {
      id: 'b-3',
      slug: 'complete-guide-to-pdf-redaction',
      title: 'The Complete Guide to Irreversible PDF Redaction',
      category: 'Productivity',
      author: 'Privacy Architect',
      excerpt: 'Why black boxes over text are dangerous and how true vector-level stream expunging protects your data.',
      status: 'DRAFT',
      publishedAt: 'Scheduled for Dec 01, 2025',
      content: '## Black Boxes Do Not Protect You\n\nDrawing a black annotation over text does not erase the underlying bytes...',
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<BlogPostDraft>(posts[0]);

  const handleUpdate = (field: keyof BlogPostDraft, val: any) => {
    const updated = { ...selectedPost, [field]: val };
    setSelectedPost(updated);
    setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreateNew = () => {
    const newPost: BlogPostDraft = {
      id: `b-${Date.now()}`,
      slug: 'new-article',
      title: 'New PDF Guide Title',
      category: 'PDF Guides',
      author: 'Technical Team',
      excerpt: 'Short excerpt describing the article for search results.',
      status: 'DRAFT',
      publishedAt: 'Draft',
      content: '## Introduction\n\nWrite article content here...',
    };
    setPosts([...posts, newPost]);
    setSelectedPost(newPost);
  };

  const handlePublish = () => {
    console.log(`Publishing blog post /blog/${selectedPost.slug} to database and cache:config:blog:${selectedPost.slug}`);
  };

  return (
    <BuilderEngine
      title="Blog &amp; SEO Guides Studio"
      subtitle="Publish long-tail SEO guides, manage author taxonomies, and preview Google snippet results."
      previewUrl={`http://localhost:3000/blog/${selectedPost.slug}`}
      onPublish={handlePublish}
    >
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        {/* Post Switcher */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex flex-wrap gap-2">
            {posts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPost(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPost.id === p.id
                    ? 'bg-[var(--primary-500)] text-white shadow-sm'
                    : 'bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
                }`}
              >
                /{p.slug}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateNew}
            className="px-3 py-1.5 rounded-xl bg-[var(--secondary)] text-white font-bold text-xs hover:bg-black inline-flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>New Post</span>
          </button>
        </div>

        {/* Post Metadata Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
              Article Title
            </label>
            <input
              type="text"
              value={selectedPost.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Category
              </label>
              <select
                value={selectedPost.category}
                onChange={(e) => handleUpdate('category', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
              >
                <option value="PDF Guides">PDF Guides</option>
                <option value="Security & Privacy">Security &amp; Privacy</option>
                <option value="Productivity">Productivity</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Status
              </label>
              <select
                value={selectedPost.status}
                onChange={(e) => handleUpdate('status', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
              >
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
              Short Excerpt (Summary for Cards &amp; SEO)
            </label>
            <textarea
              rows={2}
              value={selectedPost.excerpt}
              onChange={(e) => handleUpdate('excerpt', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)]"
            />
          </div>
        </div>

        {/* Google SERP Snippet Preview */}
        <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Google Search Rich Snippet Preview
          </span>
          <span className="text-xs font-mono text-emerald-700">
            https://simplifypdf.com/blog/{selectedPost.slug}
          </span>
          <span className="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
            {selectedPost.title} — SimplifyPDF
          </span>
          <p className="text-[11px] text-[var(--muted)] line-clamp-2">{selectedPost.excerpt}</p>
        </div>

        {/* Content Body Editor */}
        <div className="pt-2 border-t border-[var(--line)]">
          <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
            Markdown Content Body
          </label>
          <textarea
            rows={10}
            value={selectedPost.content}
            onChange={(e) => handleUpdate('content', e.target.value)}
            className="w-full p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)] font-mono text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)]"
          />
        </div>
      </div>
    </BuilderEngine>
  );
}
