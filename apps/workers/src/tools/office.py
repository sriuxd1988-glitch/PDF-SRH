import subprocess
import threading
import os
import logging
from pdf2docx import Converter

logger = logging.getLogger("ToolOffice")

# Strict Concurrency Guard: exactly 1 concurrent LibreOffice instance to protect VPS memory
_office_semaphore = threading.Semaphore(1)

def convert_office_to_pdf(input_path: str, output_path: str, timeout_sec: int = 60) -> str:
    """
    Converts Office docs (DOCX, XLSX, PPTX) to PDF using LibreOffice headless.
    Guarded by a concurrency semaphore of 1.
    """
    with _office_semaphore:
        logger.info(f"Starting LibreOffice headless conversion for {input_path}")
        out_dir = os.path.dirname(output_path) or "."

        cmd = [
            "soffice",
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            out_dir,
            input_path,
        ]

        try:
            res = subprocess.run(cmd, check=True, timeout=timeout_sec, capture_output=True)
            logger.info(f"LibreOffice stdout: {res.stdout.decode('utf-8')}")

            # LibreOffice writes to <input_basename>.pdf
            base = os.path.splitext(os.path.basename(input_path))[0]
            generated_pdf = os.path.join(out_dir, f"{base}.pdf")

            if os.path.exists(generated_pdf) and generated_pdf != output_path:
                os.rename(generated_pdf, output_path)

            return output_path
        except subprocess.TimeoutExpired:
            logger.error(f"LibreOffice conversion timed out after {timeout_sec} seconds")
            raise TimeoutError("Document conversion timed out")
        except Exception as e:
            logger.error(f"LibreOffice error: {e}")
            raise e

def convert_pdf_to_word(input_path: str, output_docx_path: str) -> str:
    """
    Converts PDF to Word (.docx) using pdf2docx (MIT permissive license).
    """
    logger.info(f"Converting PDF to Word: {input_path} -> {output_docx_path}")
    cv = Converter(input_path)
    cv.convert(output_docx_path, start=0, end=None)
    cv.close()
    return output_docx_path
