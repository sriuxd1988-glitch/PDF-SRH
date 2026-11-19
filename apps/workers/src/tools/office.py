import subprocess
import os
import time
import logging
import redis
from pdf2docx import Converter

logger = logging.getLogger("ToolOffice")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

LOCK_NAME = "lock:libreoffice:semaphore"
LOCK_TIMEOUT = 70 # auto-expire after 70 seconds to prevent deadlocks

def convert_office_to_pdf(input_path: str, output_path: str, timeout_sec: int = 60) -> str:
    """
    Converts Office docs (DOCX, XLSX, PPTX) to PDF using LibreOffice headless.
    Guarded by a distributed Redis lock semaphore = 1 across all worker containers.
    """
    out_dir = os.path.dirname(output_path) or "."
    acquired = False

    try:
        # Step 1: Acquire distributed Redis semaphore lock
        logger.info(f"Waiting for LibreOffice concurrency lock '{LOCK_NAME}'...")
        start_wait = time.time()
        while not acquired:
            # Atomically set lock with NX (not exists) and EX (expire)
            acquired = r.set(LOCK_NAME, "locked", nx=True, ex=LOCK_TIMEOUT)
            if acquired:
                break
            if time.time() - start_wait > 90:
                raise TimeoutError("Timed out waiting for LibreOffice converter slot")
            time.sleep(0.5)

        logger.info(f"Acquired LibreOffice slot. Converting {input_path} -> PDF")

        # Step 2: Execute sandboxed LibreOffice conversion
        cmd = [
            "soffice",
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            out_dir,
            input_path,
        ]

        res = subprocess.run(cmd, check=True, timeout=timeout_sec, capture_output=True)
        logger.info(f"LibreOffice stdout: {res.stdout.decode('utf-8')}")

        base = os.path.splitext(os.path.basename(input_path))[0]
        generated_pdf = os.path.join(out_dir, f"{base}.pdf")

        if os.path.exists(generated_pdf) and generated_pdf != output_path:
            os.rename(generated_pdf, output_path)

        return output_path

    except subprocess.TimeoutExpired:
        logger.error(f"LibreOffice conversion timed out after {timeout_sec} seconds")
        raise TimeoutError("Document conversion timed out")
    except Exception as e:
        logger.error(f"LibreOffice conversion failed: {e}")
        raise e
    finally:
        # Step 3: Release distributed Redis lock
        if acquired:
            r.delete(LOCK_NAME)
            logger.info("Released LibreOffice concurrency lock")

def convert_pdf_to_word(input_path: str, output_docx_path: str) -> str:
    """
    Converts PDF to Word (.docx) using pdf2docx (MIT permissive license).
    Extracts text, tables, and images preserving layout.
    """
    logger.info(f"Converting PDF to Word: {input_path} -> {output_docx_path}")
    cv = Converter(input_path)
    cv.convert(output_docx_path, start=0, end=None)
    cv.close()
    return output_docx_path
