# SimplifyPDF — Phase 02 Permissive Processing Engines

## 1. 100% Permissive Open-Source Licensing Compliance

SimplifyPDF strictly bans all viral **AGPL v3** libraries (such as PyMuPDF / `fitz` and Ghostscript) to ensure complete commercial safety and avoid legal risks requiring open-sourcing backend infrastructure.

| Capability | Permissive Engine | License | Banned AGPL Alternative |
|---|---|---|---|
| PDF Rendering & Thumbnails | `pypdfium2` (Google PDFium) | Apache 2.0 / BSD-3 | PyMuPDF / `fitz` (AGPL v3) |
| Merge, Split, AES Encryption | `pikepdf` | MPL 2.0 | PyMuPDF (AGPL v3) |
| Stream Linearization & Compaction | `qpdf` | Apache 2.0 | Ghostscript (AGPL v3) |
| PDF to Microsoft Word (.docx) | `pdf2docx` | MIT | Commercial Adobe SDKs |
| Image Compilation & Downsampling | `Pillow` (PIL) | HPND | ImageMagick / Ghostscript |
| Office to PDF (DOCX, XLSX, PPTX) | Sandboxed LibreOffice Headless | LGPL v3 / MPL 2.0 | Proprietary cloud converters |

---

## 2. Direct-to-Storage Presigned Uploads (MinIO S3)

* **Upload Path**: The browser requests a short-lived (15 min) presigned PUT URL from `POST /api/storage/presigned-upload` and streams the file directly to MinIO S3 without buffering through Node.js.
* **Tier Capacity Limits**:
  * Guest: 25 MB
  * Free Member: 50 MB
  * Pro / Admin: 2048 MB (2 GB)
* **Lifecycle & Auto-Shredding**:
  * An automated background service (`FileCleanupService`) scans every 15 minutes for expired jobs (`expiresAt < NOW()`).
  * Expired files in S3 are permanently shredded (2 hours for free, 24 hours for pro).

---

## 3. Dual-Priority Redis Streams Task Broker

* **Streams**:
  * `stream:pdf-jobs:pro`: High-priority stream for Pro and Enterprise users.
  * `stream:pdf-jobs`: Standard FIFO queue for free and guest users.
* **Consumer Priority**:
  * Python daemons read from both streams simultaneously:
    `XREADGROUP GROUP pdf-workers-group worker-1 BLOCK 3000 COUNT 1 STREAMS stream:pdf-jobs:pro stream:pdf-jobs >`
  * Pro jobs are guaranteed to execute ahead of guest waitlines.
* **Real-time Progress Rail**:
  * Status transitions (`QUEUED` -> `SCANNING` -> `PROCESSING` -> `COMPLETED` / `FAILED`) are published on Redis channel `job:status:{jobId}` and consumed by NestJS Server-Sent Events (SSE).

---

## 4. LibreOffice Concurrency Guard for 2 vCPU VPS

* **Resource Safeguard**: Headless LibreOffice conversions consume considerable RAM and CPU.
* **Distributed Semaphore**: A distributed Redis key `lock:libreoffice:semaphore` limits simultaneous conversions to **strictly 1 at a time** across all worker instances.
* **Execution Timeout**: 60-second hard kill timeout prevents hung soffice processes from exhausting VPS memory.

---

## 5. Automated Verification Results

All unit tests in `apps/workers/test_tools.py` executed cleanly:
```
test_compress_pdf .......... OK (Stream linearization & pikepdf compaction)
test_images_to_pdf ......... OK (PIL image compilation)
test_merge_pdfs ............ OK (Pikepdf multi-document append)
test_organize_pdf .......... OK (90/180/270 deg rotations & page deletion)
test_protect_and_unlock .... OK (256-bit AES encryption & authenticated unlock)
test_split_pdf ............. OK (Custom page range extraction)
----------------------------------------------------------------------
Ran 6 tests in 0.289s — 100% SUCCESS
```
