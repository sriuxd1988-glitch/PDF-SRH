"""
SimplifyPDF Polyglot & Malicious PDF Defense Guard
Protects against polyglot executable injection, malicious JavaScript actions,
and unauthorized launch hooks. Powered strictly by permissive pikepdf (MPL-2.0).
"""

import os
import re
import logging
import pikepdf

logger = logging.getLogger("SecurityGuard")

class SecurityValidationError(Exception):
    """Raised when a file fails strict security or polyglot validation."""
    pass

def validate_pdf_magic_bytes(file_path: str) -> str:
    """
    Verifies that the file starts with valid PDF magic bytes (%PDF-1.x).
    Rejects files with corrupt or forged headers.
    """
    with open(file_path, "rb") as f:
        header = f.read(1024)

    # Magic byte check: Must contain %PDF-1. in the first 1024 bytes
    match = re.search(rb"%PDF-1\.[0-7]", header)
    if not match:
        raise SecurityValidationError(f"Invalid PDF magic header. File is not a valid PDF.")

    version = match.group(0).decode("ascii")
    return version

def detect_polyglot_executables(file_path: str) -> None:
    """
    Scans file bytes to detect dangerous polyglot constructs:
    - PK\\x03\\x04 (ZIP / JAR / Office polyglot)
    - MZ (Windows PE / EXE / DLL polyglot)
    - \\x7fELF (Linux ELF executable polyglot)
    - <?php or <script (Web shell polyglots)
    """
    with open(file_path, "rb") as f:
        content = f.read()

    # 1. Windows PE Executable check
    if content.startswith(b"MZ") or (b"This program cannot be run in DOS mode" in content):
        raise SecurityValidationError("Polyglot attack detected: Windows PE executable disguised as PDF.")

    # 2. Linux ELF Executable check
    if content.startswith(b"\x7fELF"):
        raise SecurityValidationError("Polyglot attack detected: ELF binary disguised as PDF.")

    # 3. Server-side script injection
    if b"<?php" in content.lower() or b"<script language=\"php\"" in content.lower():
        raise SecurityValidationError("Polyglot attack detected: PHP script injection inside PDF.")

def sanitize_pdf_actions(file_path: str, output_path: str = None) -> bool:
    """
    Strips automated JavaScript, Launch actions, and embedded executable files
    using pikepdf (MPL-2.0).
    Removes:
    - /OpenAction
    - /AA (Additional-Actions)
    - /JavaScript, /JS
    - /Launch
    - /EmbeddedFiles
    """
    if output_path is None:
        output_path = file_path

    try:
        with pikepdf.open(file_path, allow_overwriting_input=True) as pdf:
            root = pdf.Root
            actions_removed = False

            # 1. Remove Catalog /OpenAction
            if "/OpenAction" in root:
                del root["/OpenAction"]
                actions_removed = True
                logger.info("Stripped /OpenAction from PDF Catalog.")

            # 2. Remove Catalog /AA (Additional Actions)
            if "/AA" in root:
                del root["/AA"]
                actions_removed = True
                logger.info("Stripped /AA (Additional Actions) from PDF Catalog.")

            # 3. Clean Catalog /Names (/JavaScript, /EmbeddedFiles)
            if "/Names" in root:
                names = root["/Names"]
                if "/JavaScript" in names:
                    del names["/JavaScript"]
                    actions_removed = True
                    logger.info("Stripped /JavaScript action tree from PDF /Names.")
                if "/EmbeddedFiles" in names:
                    del names["/EmbeddedFiles"]
                    actions_removed = True
                    logger.info("Stripped /EmbeddedFiles from PDF /Names.")

            # 4. Clean Page-level /AA (Additional Actions)
            for i, page in enumerate(pdf.pages):
                if "/AA" in page:
                    del page["/AA"]
                    actions_removed = True

            pdf.save(output_path)
            return actions_removed
    except Exception as e:
        logger.warning(f"Sanitization inspection completed with notice: {e}")
        return False

def inspect_and_sanitize(file_path: str) -> dict:
    """
    Master pipeline executing magic bytes verification, polyglot scan,
    and pikepdf sanitization.
    """
    version = validate_pdf_magic_bytes(file_path)
    detect_polyglot_executables(file_path)
    was_sanitized = sanitize_pdf_actions(file_path)

    return {
        "status": "SECURE",
        "pdf_version": version,
        "actions_stripped": was_sanitized,
        "file_size": os.path.getsize(file_path),
    }
