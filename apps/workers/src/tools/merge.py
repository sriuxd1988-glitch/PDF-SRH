import pikepdf
import logging
from typing import List

logger = logging.getLogger("ToolMerge")

def merge_pdfs(input_paths: List[str], output_path: str) -> str:
    """
    Merges multiple PDF documents in given order using pikepdf.
    Permissive MPL 2.0.
    """
    merged_pdf = pikepdf.Pdf.new()

    for path in input_paths:
        logger.info(f"Merging PDF: {path}")
        with pikepdf.open(path) as src:
            merged_pdf.pages.extend(src.pages)

    merged_pdf.save(output_path, linearize=True)
    return output_path
