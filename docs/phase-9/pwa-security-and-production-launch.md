# Phase 09: PWA, Security Hardening, QA & Production Launch Architecture

## 1. Overview
Phase 09 completes the final hardening, progressive web app capabilities, automated quality assurance, and production infrastructure for the **SimplifyPDF** platform:
- **Mobile PWA & Web Share Target**: Full offline app shell caching, high-resolution SVG icons, manifest shortcuts, and native OS Share Target for PDF files (`/share-target`).
- **OWASP Security Hardening & Polyglot Defense**: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, Permissions-Policy, ClamAV antivirus stream scanning, and pikepdf-powered polyglot/malicious JavaScript sanitization (`security_guard.py`).
- **Global Rate Limiting**: NestJS `@nestjs/throttler` token bucket limiter enforcing 60 requests/minute per IP across standard endpoints.
- **Corpus Regression & E2E Testing**:
  - Automated 6-document test corpus covering multilingual text, scanned forms, passwords, and metadata.
  - 100% passing regression test suite across all permissive engines (`pypdfium2`, `pikepdf`, `pdf2docx`, `Pillow`).
  - Playwright E2E test suite covering guest conversion, Pro batch studio, admin design propagation, and WCAG 2.2 AA accessibility (pure white text `#FFFFFF` on primary `#864FFE`).
  - k6 load test simulating 200 concurrent users at 3x peak load with p99 response times < 1.5s.
- **Production Hostinger VPS & Coolify Infrastructure**:
  - `docker-compose.prod.yml` with strict CPU and RAM resource caps per container to prevent OOM server lockup.
  - Automated Ubuntu 24.04 LTS hardening script (`scripts/setup-vps-hardening.sh`) with UFW firewall, Fail2Ban jails, SSH key-only auth, and Linux kernel TCP tuning.
  - Automated off-site Cloudflare R2 backup pipeline (`scripts/backup-r2.sh`) and verified 15-minute Disaster Recovery drill restore script (`scripts/restore-r2.sh`).

---

## 2. Progressive Web App (PWA) Architecture

### Manifest Specification (`apps/web/public/manifest.json`)
- **Name**: `SimplifyPDF — All-in-One PDF Tools`
- **Short Name**: `SimplifyPDF`
- **Theme Color**: `#864FFE` | **Background Color**: `#FAF9F7`
- **Icons**:
  - Standard: `/icons/icon-192.svg` & `/icons/icon-512.svg`
  - Android Maskable: `/icons/icon-maskable.svg` (with 80% safe zone padding)
- **Web Share Target API**:
  ```json
  "share_target": {
    "action": "/share-target",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [{ "name": "file", "accept": ["application/pdf", ".pdf"] }]
    }
  }
  ```

### Service Worker (`apps/web/public/sw.js`)
- Pre-caches static shell assets (`/`, `/offline.html`, `/manifest.json`, vector icons).
- Cache-first strategy for static vector images and web fonts.
- Network-first strategy for dynamic tool execution routes with graceful fallback to `/offline.html`.
- Intercepts Web Share Target POST requests, caches the shared document buffer, and redirects the mobile user directly to `/tools/compress?shared=1`.

---

## 3. Security Hardening & Threat Model Mitigation

### HTTP Security Headers
Configured across Next.js (`apps/web/next.config.js`) and NestJS Fastify (`apps/api/src/main.ts`):
- `Content-Security-Policy`: Restricts scripts, frames, and connections to trusted origins (`checkout.razorpay.com`, `js.stripe.com`, `api.simplifypdf.com`, `*.amazonaws.com`).
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options`: `SAMEORIGIN`
- `X-Content-Type-Options`: `nosniff`
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: `camera=(), microphone=(), geolocation=()`

### Polyglot & Malicious PDF Defense (`apps/workers/src/security_guard.py`)
1. **Magic Bytes Validation**: Verifies `%PDF-1.x` signature in header bytes. Rejects corrupt or forged files.
2. **Polyglot Executable Detection**: Scans file contents for embedded Windows PE (`MZ`), Linux ELF (`\x7fELF`), and script injections (`<?php`).
3. **Automated Action Stripping**: Uses `pikepdf` (MPL-2.0) to parse the document Catalog and strip `/OpenAction`, page-level `/AA` (Additional-Actions), `/JavaScript`, `/JS`, and `/Launch` hooks before processing.

---

## 4. Testing, QA & Load Simulation

### Test Corpus & Regression Matrix
Run via `apps/workers/.venv/bin/python tests/corpus/run_corpus_regression.py`:
- `standard_document.pdf`: Linearization & compression (44.5ms) ✅
- `scanned_form.pdf`: Extreme compression (60.8ms) ✅
- `unicode_multilingual.pdf`: Unicode merge (2.8ms) ✅
- `multipage_book.pdf`: 10-page extraction & split (4.6ms) ✅
- `encrypted_secure.pdf`: Password unlock (13.0ms) ✅
- `tagged_metadata.pdf`: Sensitive metadata redaction (3.9ms) ✅
- `standard_document.pdf`: Cryptographic audit e-signature (127.4ms) ✅
- **All Corpus Files**: Magic header & polyglot security guard verification (0.5ms) ✅

### Playwright E2E Test Suite (`tests/e2e/flows.spec.ts`)
- **Flow 1**: Guest homepage dropzone → Compress tool navigation → Preset options verification.
- **Flow 2**: Pro upgrade → Sandbox checkout → Success confetti → 2GB limit unblocking.
- **Flow 3**: Admin console → Live Design Studio → Nuvexa brand tokens live sync.
- **Flow 4**: WCAG 2.2 AA accessibility audit & pure white button text contrast verification (`#FFFFFF`).

### k6 Performance Load Test (`tests/k6-load-test.js`)
- Simulates 200 concurrent users at 3x peak load.
- Strict latency threshold: 99% of requests complete under 1,500ms.
- Target error rate: < 1.0%.

---

## 5. Production Infrastructure (Hostinger VPS & Coolify)

### Container Resource Limits (`docker-compose.prod.yml`)
- `workers`: 2.5 CPUs, 3,072 MB RAM limit (prevents LibreOffice/compression memory exhaustion).
- `postgres`: 2.0 CPUs, 2,048 MB RAM limit.
- `api`: 1.5 CPUs, 1,024 MB RAM limit.
- `web`: 1.5 CPUs, 1,024 MB RAM limit.
- `clamav`: 1.5 CPUs, 2,048 MB RAM limit.

### Automated Operations Scripts
- **VPS Hardening**: `scripts/setup-vps-hardening.sh` (UFW, Fail2ban, SSH key-only, kernel somaxconn tuning).
- **R2 Off-Site Backup**: `scripts/backup-r2.sh` (compressed pg_dump with SHA-256 verification to Cloudflare R2).
- **Disaster Recovery Drill**: `scripts/restore-r2.sh` (automated restore and table validation in < 15 minutes).
