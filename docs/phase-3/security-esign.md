# SimplifyPDF — Phase 03 Security, e-Sign & OCR Suite

## 1. Cryptographic e-Sign Studio (`esign.py`)

* **Signature Capture Modes**: Smooth bezier curve drawing canvas, handwritten script font typing, and transparent PNG upload.
* **Tamper-Evident Audit Certificate**:
  * Every signed document is appended with a cryptographic Audit Trail Certificate page.
  * Captures Document Title, SHA-256 Integrity Checksum, Signer Attribution, UTC Timestamp, and Unique Audit Verification ID.
  * Complies with US ESIGN Act, EU eIDAS, and India Information Technology Act 2000.

---

## 2. Server-Side OCR Pipeline (`ocr.py`)

* **Engines**: `OCRmyPDF` + `Tesseract 5` (100% Permissive Apache 2.0).
* **Capabilities**: Multilingual text recognition (`eng`, `spa`, `fra`, `deu`, `hin`, `chi_sim`), skew correction (`--deskew`), and PDF/A archiving compliance.
* **Outputs**: Searchable PDF/A with invisible selectable text layer + sidecar `.txt` extracted text file.

---

## 3. AES-256 PDF Security & Zero-Log Passwords (`security.py`)

* **256-bit AES Encryption**: Strict `pikepdf` encryption with user password (to open) and optional owner password (to restrict printing, copying, or modifications).
* **Zero-Log Guarantee**: Passwords exist only in ephemeral worker RAM during the single encryption/decryption execution and are never logged, printed, or saved.

---

## 4. Permanent Redaction & Metadata Purge (`redact.py`)

* **True Stream Removal**: Content under redacted bounding boxes is stripped from underlying content streams so text cannot be highlighted, selected, or extracted.
* **Privacy Compliance**: All PDF metadata (`/Metadata`, `/DocInfo`, author, creation software) is completely stripped.
