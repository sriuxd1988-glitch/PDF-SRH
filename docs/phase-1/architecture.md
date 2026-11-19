# SimplifyPDF — Phase 01 Architecture Specification

## 1. Monorepo Structure & Workspaces

The SimplifyPDF platform is organized as a Turborepo + pnpm monorepo:

```
simplify-pdf-monorepo/
├── apps/
│   ├── web/          # Public Next.js 15 App Router website (16 Nuvexa sections, dropzone, tools, pricing)
│   ├── app/          # Authenticated user dashboard (Free & Pro workspaces, Batch ZIP studio)
│   ├── admin/        # Admin control center & Live Design System Studio
│   ├── api/          # High-performance NestJS Fastify API (S3 presigned URLs, quotas, job queue)
│   └── workers/      # Python 3.11 worker daemons (pypdfium2, pikepdf, qpdf, LibreOffice)
├── packages/
│   ├── ui/           # Nuvexa design tokens, NextSaaS components (.btn-v6, pills, glow cards), strict white text buttons
│   ├── database/     # Prisma ORM PostgreSQL schema (24 models), seed scripts, singleton client
│   ├── auth/         # Auth.js v5, Argon2id password hashing, Otplib TOTP MFA
│   └── types/        # TypeScript DTOs, Zod schemas, centralized environment validation
├── docker-compose.yml # PostgreSQL 16, Redis 7, MinIO S3, ClamAV daemon
└── turbo.json        # Turborepo task pipeline
```

---

## 2. PostgreSQL 16 Relational Schema (24 Models)

All database models are managed via Prisma in `packages/database/prisma/schema.prisma`:

1. **Authentication & Identity**:
   * `User`: Primary user model with roles (`GUEST`, `USER`, `PRO`, `ADMIN`, `SUPER_ADMIN`).
   * `Account`: OAuth provider credentials (e.g. Google).
   * `Session`: Session tracking tokens.
   * `VerificationToken`: Passwordless magic links.
   * `AdminMfa`: Encrypted TOTP secret and hashed backup recovery codes.

2. **Plans & Quotas**:
   * `Plan`: Free Starter vs SimplifyPDF Pro with file limits (50MB vs 2048MB), daily tasks (10 vs 250), batch limits (1 vs 100), and retention hours (2h vs 24h).
   * `UserQuota`: Daily tasks used and monthly OCR pages tracked per registered user.
   * `GuestQuota`: Daily tasks tracked per visitor using salted SHA-256 hashes of `CF-Connecting-IP`.

3. **PDF Jobs & File Lifecycle**:
   * `Job`: Tracks job state (`QUEUED`, `SCANNING`, `PROCESSING`, `COMPLETED`, `FAILED`), S3 keys, execution duration, and expiration timestamps.
   * `JobFile`: Multi-file batch tracking for Pro batch operations.

4. **Subscriptions & Billing**:
   * `Subscription`: Multi-gateway support (Stripe & Razorpay) with status tracking (`ACTIVE`, `PAST_DUE`, `CANCELED`).
   * `Invoice`: Invoice receipts, billing amounts, currencies (`INR` / `USD`), and signed PDF download links.

5. **Website Builders & Live Design System Studio**:
   * `SiteSettings`: Live design tokens (`primaryColor`, `secondaryColor`, `accentLime`, `borderRadius`) with `liveSyncVersion` for instant propagation.
   * `HeaderConfig` & `NavigationItem`: Dynamic navigation links, call-to-actions, and badges.
   * `FooterConfig`, `FooterColumn` & `FooterLink`: 4-column published footer.
   * `NotificationBar`: Dismissible announcement banner.
   * `PageBlock`: Dynamic page sections (`HERO`, `DROPZONE`, `TRUST`, `TOOLS`, `HOW_IT_WORKS`, `PRICING`, `FAQ`, `CTA`).
   * `BlogPost`: MDX content management for SEO and tutorials.
   * `ToolConfig`: Per-tool maintenance mode and kill switches.

6. **Auditing & Monitoring**:
   * `AuditLog`: Immutable log of admin configuration modifications.
   * `SystemHealthSnapshot`: Periodic metrics (CPU, RAM, Redis stream lag, active workers).

---

## 3. RBAC & Security Pipeline

* **Role-Based Access Control**:
  * `/app/*`: Protected by `apps/app/middleware.ts`. Requires valid session token; redirects unauthenticated visitors to `/login`.
  * `/admin/*`: Protected by `apps/admin/middleware.ts`. Strictly enforces `ADMIN` or `SUPER_ADMIN` role and validates TOTP 2FA.
* **Quota Enforcement**:
  * Handled at API gateway level via `apps/api/src/common/guards/quota.guard.ts`.
  * Guests: Atomic Redis counter `guest:quota:{ipHash}:{date}`. Blocked after 3 tasks with `429 Too Many Requests`.
  * Free Users: Atomic Redis counter `user:quota:{userId}:{date}`. Blocked after 10 tasks with `429 Too Many Requests`.
  * Pro & Admin: Uncapped high-throughput execution.

---

## 4. Configuration Caching & Instant Invalidation

* **Redis Caching Strategy**:
  * Keys: `cache:config:header`, `cache:config:footer`, `cache:config:page:{slug}`, `cache:config:settings`, `cache:tools:active`.
  * TTL: 86,400 seconds (24 hours).
* **Instant Cache Purge**:
  * Admin updates invoke `redis.del()` on the respective key.
  * Pub/Sub event `config:invalidated` is broadcasted, triggering Next.js on-demand ISR tag revalidation across serverless and edge nodes.
