import os
import pikepdf
import pypdfium2 as pdfium
import logging
from typing import List, Dict, Optional

logger = logging.getLogger("ToolOrganize")

def organize_pdf(
    input_path: str,
    output_path: str,
    rotations: Optional[Dict[str, int]] = None,
    delete_pages: Optional[List[int]] = None,
    page_order: Optional[List[int]] = None
) -> str:
    """
    Rotates, deletes, or re-orders pages in a PDF document using pikepdf.
    100% Permissive MPL 2.0 open-source library.
    
    :param input_path: Source PDF file
    :param output_path: Destination PDF file
    :param rotations: Dict of {"pageNumber": degrees} e.g. {"1": 90, "3": 180}
    :param delete_pages: List of 1-based page numbers to delete e.g. [2, 4]
    :param page_order: Custom 1-based list of page order e.g. [3, 1, 2]
    """
    rotations = rotations or {}
    delete_pages = set(delete_pages or [])

    with pikepdf.open(input_path) as pdf:
        total_pages = len(pdf.pages)

        # 1. Apply Rotations
        for page_str, degrees in rotations.items():
            try:
                page_idx = int(page_str) - 1
                if 0 <= page_idx < total_pages:
                    pdf.pages[page_idx].Rotate = (pdf.pages[page_idx].get("/Rotate", 0) + degrees) % 360
            except Exception as e:
                logger.warning(f"Failed to rotate page {page_str}: {e}")

        # 2. Re-order or Delete
        new_pdf = pikepdf.Pdf.new()

        if page_order and len(page_order) > 0:
            for p in page_order:
                if 1 <= p <= total_pages and p not in delete_pages:
                    new_pdf.pages.append(pdf.pages[p - 1])
        else:
            for idx in range(total_pages):
                page_num = idx + 1
                if page_num not in delete_pages:
                    new_pdf.pages.append(pdf.pages[idx])

        new_pdf.save(output_path, linearize=True)
        return output_path

def generate_page_thumbnails(input_path: str, output_dir: str, thumbnail_width: int = 150) -> List[str]:
    """
    Renders fast 150px PNG thumbnails of each PDF page using pypdfium2.
    Permissive BSD-3-Clause / Apache 2.0.
    """
    os.makedirs(output_dir, exist_ok=True)
    pdf = pdfium.PdfDocument(input_path)
    thumbnail_paths = []

    for i in range(len(pdf)):
        page = pdf[i]
        # Calculate scale to match desired thumbnail width
        original_width, original_height = page.get_size()
        scale = thumbnail_width / original_width

        pil_image = page.render(scale=scale).to_pil()
        thumb_name = f"thumb_{i + 1:03d}.png"
        thumb_path = os.path.join(output_dir, thumb_name)
        pil_image.save(thumb_path, format="PNG", optimize=True)
        thumbnail_paths.append(thumb_path)

    return thumbnail_paths
