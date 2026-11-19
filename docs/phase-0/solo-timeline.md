# SimplifyPDF — Solo Developer Execution Timeline & Milestone Plan

This document establishes the week-by-week roadmap, technical milestones, testing checkpoints, and Git release criteria for **SimplifyPDF (SimplifyPDF.com)** as a solo-developer project.

---

## 1. Core Operating Principles

1. **Phase-by-Phase Git Pushes**:
   * Code is developed, tested, and validated locally/on staging throughout each phase.
   * A clean Git commit and push to the remote GitHub repository is performed strictly upon completing each phase's verified exit criteria.
   * The GitHub repository link will be requested from the user as Phase 0 concludes.

2. **Coolify CI/CD Deployment Timing**:
   * Automated Coolify deploy-on-push hooks will be reviewed, tested, and configured **after the final hardening phase (Phase 9)** is complete.
   * During Phases 0 through 8, automated deployment triggers are ignored to avoid premature rebuilds and deployment churn.

3. **100% Permissive Open-Source Licensing**:
   * **Banned**: All GNU AGPL v3 packages (PyMuPDF / `fitz`, Ghostscript).
   * **Approved**: `pypdfium2` (Apache 2.0 / BSD-3, based on Google PDFium), `pikepdf` (MPL 2.0), `pypdf` (BSD-3), `qpdf` (Apache 2.0), `pdf2docx` (MIT), `OCRmyPDF` / Tesseract (Apache 2.0).

4. **Direct-to-Storage Presigned Uploads**:
   * Large files (up to 2GB Pro) never touch Node.js buffers. The browser uploads directly to MinIO S3 via presigned PUT URLs, protecting the 2 vCPU VPS from memory exhaustion.

---

## 2. Milestone Roadmap Breakdown

```
[ Month 1 ] ─────► Phase 00 (Design System & Auth) & Phase 0 (Monorepo & DB) & Phase 1 (UI Shell)
[ Month 2 ] ─────► Phase 2 (Core PDF Engine & Free Tools)
[ Month 3 ] ─────► Phase 3 (Accounts, Billing & Early Paid Batch Features) ──► [MVP LAUNCH & EARNINGS]
[ Month 4 ] ─────► Phase 4 (Unified Admin Dashboard) & Phase 5 (Pragmatic CMS & SEO)
[ Month 5 ] ─────► Phase 6 (Advanced Tools: e-Sign, Redact, Protect, OCR)
[ Month 6 ] ─────► Phase 7 (Workflows, Cloud Drive & AI) & Phase 8 (Growth & Analytics)
[ Month 7 ] ─────► Phase 9 (Hardening, Security, Coolify Auto-Deploy & Public Launch)
```

---

## 3. Detailed Weekly Schedule

### Milestone 1: Design System, Foundations & UI Shell (Weeks 1–4)
* **Week 1 (Phase 00: Design System & Premium Auth Screens - Prompts 0.1–0.3)**
  * **Prompt 0.1**: Configure Nuvexa-inspired design tokens:
    * Primary 500: `#864FFE` (Violet) with **pure white text (`#FFFFFF`) on all primary buttons** (WCAG AA 4.6:1+).
    * Primary 700: `#6D1FE2`.
    * Secondary: `#1A1A1C` (Near-black).
    * Accents: Lime (`#C6F56F`), Cyan (`#83E7EE`), Yellow (`#F9EB57`).
    * Light paper (`#FAF9F7`) and dark theme (`#0B0B10`).
    * Typography: Inter Tight headings (-0.02em) and Inter body.
  * **Prompt 0.2**: Build component library in `packages/ui` (shadcn/ui + Tailwind + Lucide):
    * NextSaaS vertical roll button (`.btn-v6`) with white text on primary.
    * Lateral arrow slide button (`.nextsaas-btn`).
    * Mouse-following glowing cards (`.nextsaas-glow-card`).
    * Status badges with pulsating dots (`.nextsaas-badge`).
  * **Prompt 0.3**: Build AI-Awaaz style split-screen auth layouts (`src/app/(auth)/`).
  * **Git Push Action**: Commit Phase 00 Design System & Auth screens to GitHub.

* **Week 2 (Phase 0: Workspace, Monorepo & Infrastructure Setup)**
  * Initialize pnpm monorepo with Turborepo (`apps/web`, `apps/admin`, `apps/api`, `packages/ui`, `packages/types`).
  * Provision staging services: PostgreSQL 16, Redis, and MinIO on staging VPS.
  * Benchmark permissive Python PDF engines (`pypdfium2`, `pikepdf`, `qpdf`).
  * Finalize database schema (Prisma ORM) for users, quotas, and transactions.
  * Configure Cloudflare DNS for `simplifypdf.com`, `admin.simplifypdf.com`, and `api.simplifypdf.com`.
  * **Git Push Action**: Commit Phase 0 foundations to GitHub.

* **Week 3 (Phase 1: Component Library & Marketing Sections)**
  * Wire components into shared `packages/ui`.
  * Build core accessible sections: Universal Drop Zone, Tool Grid, Comparison Table, Pricing Table (INR/USD toggle).
  * Build responsive layouts (Header, Mega-Menu, Footer, Privacy Banner).

* **Week 4 (Phase 1: Shell Verification & Lighthouse Audit)**
  * Test responsive layouts across 360px, 768px, and 1280px viewports.
  * Audit accessibility via Axe & Lighthouse (Target: Mobile Score ≥ 90).
  * **Git Push Action**: Commit Phase 1 UI system to GitHub.
  * Audit accessibility via Axe & Lighthouse (Target: Mobile Score ≥ 90).
  * **Git Push Action**: Commit Phase 1 UI system to GitHub.

---

### Milestone 2: Core PDF Engine & Free Tools (Weeks 5–8)
* **Week 5 (Phase 2: Storage & Direct Upload Pipeline)**
  * Implement NestJS presigned upload URL generator for MinIO.
  * Build client-side direct PUT uploader with chunked progress tracking.
  * Configure automated MinIO lifecycle rule: 1-hour auto-delete for guest files.
* **Week 6 (Phase 2: Job Queue & Python Worker Daemon)**
  * Set up Redis Streams / Queue with JSON task payloads and atomic acknowledgments.
  * Build Python worker daemon consuming PDF processing jobs.
  * Implement ClamAV pre-processing scan.
* **Week 7 (Phase 2: Core Free PDF Tools)**
  * Implement Merge PDF (with drag-and-drop page order).
  * Implement Split PDF (range and page extraction).
  * Implement Compress PDF via `qpdf` + Pillow (Basic and Recommended levels).
  * Implement Rotate, Delete, and Reorder pages.
  * Implement PDF to JPG/PNG and Images to PDF.
* **Week 8 (Phase 2: Office Conversion & Progress Feedback)**
  * Implement sandboxed LibreOffice conversion (concurrency semaphore = 1, 60s timeout).
  * Wire Server-Sent Events (SSE) for real-time progress updates in the browser.
  * Implement guest rate limiting using Cloudflare `CF-Connecting-IP`.
  * **Git Push Action**: Commit Phase 2 core engine to GitHub.

---

### Milestone 3: Accounts, Billing & Early Paid Value (Weeks 9–11)
* **Week 9 (Phase 3: Auth & User Dashboard)**
  * Implement Auth.js: Google OAuth, Email Magic Link, and password credentials.
  * Build User Dashboard: Recent processed files, remaining daily tasks meter, active plan overview.
* **Week 10 (Phase 3: Dual Payment Integration)**
  * Implement Razorpay Subscriptions (for India UPI and RuPay cards).
  * Implement Stripe Billing (for international credit cards).
  * Build idempotent webhook listeners for subscription creation, renewals, and cancellations.
* **Week 11 (Phase 3: Early Paid Value Delivery)**
  * Unlock 2GB file limit for Pro subscribers.
  * Implement Batch Processing (up to 100 files simultaneously with consolidated ZIP download).
  * Enable priority job queue routing for Pro users.
  * Initial OCR integration via `OCRmyPDF` with monthly page allowances.
  * **Git Push Action**: Commit Phase 3 monetization and auth modules to GitHub.

---

### Milestone 4: Admin Dashboard & Pragmatic CMS (Weeks 12–16)
* **Week 12 (Phase 4: Admin Security & Overview)**
  * Implement Admin RBAC with mandatory TOTP MFA.
  * Build Executive Overview: Daily active users, tasks, conversion rates, MRR, and error metrics.
* **Week 13 (Phase 4: User & Quota Management)**
  * Build User search, inspection, plan override, and GDPR deletion console.
  * Build dynamic Plans & Quotas editor (adjust file sizes, daily limits, and retention on the fly).
* **Week 14 (Phase 4: Tool Toggles & Live Queue Monitor)**
  * Implement tool kill-switches and maintenance mode switches.
  * Build Redis queue visualizer with dead-letter retry capabilities.
  * Build immutable administrative audit log.
  * **Git Push Action**: Commit Phase 4 admin dashboard to GitHub.
* **Week 15 (Phase 5: Database CMS for Site Content)**
  * Build admin CMS for homepage hero copy, feature highlights, FAQ accordions, and notice banners.
  * Connect Unsplash API for image picker with automated photographer attribution.
* **Week 16 (Phase 5: MDX Blog & Programmatic SEO)**
  * Build high-performance MDX blog engine.
  * Implement dynamic sitemap, JSON-LD Schema markup, and OpenGraph image generator.
  * Author 5 foundational PDF conversion and optimization guides.
  * **Git Push Action**: Commit Phase 5 CMS and SEO engine to GitHub.

---

### Milestone 5: Advanced Document Tools (Weeks 17–19)
* **Week 17 (Phase 6: e-Sign & Signature Verification)**
  * Build e-Sign canvas tool (draw signature, type with font preview, or upload image).
  * Generate cryptographic PDF signing audit certificate (timestamp, IP, signer info).
* **Week 18 (Phase 6: Security & Redaction Tools)**
  * Implement Protect PDF (AES-256 encryption, permissions control via `pikepdf`).
  * Implement Unlock PDF with zero-log password validation.
  * Build manual box Redaction tool with permanent underlying text rasterization.
* **Week 19 (Phase 6: Utility Tools & Multi-Language OCR)**
  * Implement Repair PDF, Flatten forms, and Strip metadata.
  * Tune `OCRmyPDF` multi-language recognition for Latin, Devanagari, and CJK characters.
  * **Git Push Action**: Commit Phase 6 advanced tools to GitHub.

---

### Milestone 6: Pro Power Features & Growth (Weeks 20–24)
* **Week 20 (Phase 7: Workflows Orchestrator)**
  * Build multi-step tool chain runner (e.g., Compress → Watermark → Encrypt).
  * Allow Pro users to save and rerun custom tool chains.
* **Week 21 (Phase 7: Cloud Storage Integration)**
  * Connect Google Drive and Dropbox OAuth APIs for direct file import and export.
* **Week 22 (Phase 7: Metered AI PDF Assistant)**
  * Build AI summarization and Q&A chat with PDF.
  * Implement hard quota limits in Redis to prevent AI API cost overruns.
  * **Git Push Action**: Commit Phase 7 workflows and AI modules to GitHub.
* **Week 23 (Phase 8: PostHog Analytics & Funnels)**
  * Instrument PostHog conversion tracking (Drop File → Convert → Upgrade trigger).
  * Configure transactional emails via Resend (Welcome, receipt, quota limit reached).
* **Week 24 (Phase 8: SEO Expansion & A/B Testing)**
  * Launch 50+ programmatic tool comparison pages.
  * A/B test pricing copy and upgrade modal messaging.
  * **Git Push Action**: Commit Phase 8 growth modules to GitHub.

---

### Milestone 7: Hardening, Coolify Auto-Deploy & Public Launch (Weeks 25–26)
* **Week 25 (Phase 9: Security Audit & Load Testing)**
  * Perform penetration testing (OWASP Top 10, malicious PDF payloads, path traversal checks).
  * Conduct k6 stress test at 3× peak load to verify worker queue resilience.
  * Verify disaster recovery drill: Full restore of Postgres and MinIO from Cloudflare R2 backup.
* **Week 26 (Phase 9: Coolify Automated Deployment & Launch)**
  * **Configure Coolify Deploy-on-Push**: Setup production Git webhook triggers, configure staging vs production branches, and verify automated container redeploys.
  * Conduct private beta with 100 users.
  * Enable production DNS and initiate public launch.
  * **Git Push Action**: Final production release commit, tag `v1.0.0`, and push to GitHub.
