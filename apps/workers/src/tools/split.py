import pikepdf
import zipfile
import os
import logging
from typing import Optional, List

logger = logging.getLogger("ToolSplit")

def split_pdf(input_path: str, output_path: str, page_ranges: Optional[List[int]] = None) -> str:
    """
    Extracts specific pages from PDF, or splits all pages into a zip archive if ranges are omitted.
    Permissive MPL 2.0.
    """
    with pikepdf.open(input_path) as pdf:
        total_pages = len(pdf.pages)

        # If page_ranges specified (e.g. [1, 2, 5]), extract those into a single output PDF
        if page_ranges and len(page_ranges) > 0:
            extracted_pdf = pikepdf.Pdf.new()
            for page_num in page_ranges:
                if 1 <= page_num <= total_pages:
                    extracted_pdf.pages.append(pdf.pages[page_num - 1])
            extracted_pdf.save(output_path, linearize=True)
            return output_path

        # If splitting all pages, package them into a clean ZIP archive
        temp_dir = f"{output_path}_pages"
        os.makedirs(temp_dir, exist_ok=True)
        split_files = []

        for idx, page in enumerate(pdf.pages):
            single_page_pdf = pikepdf.Pdf.new()
            single_page_pdf.pages.append(page)
            page_path = os.path.join(temp_dir, f"page_{idx + 1:03d}.pdf")
            single_page_pdf.save(page_path)
            split_files.append(page_path)

        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for file in split_files:
                zipf.write(file, arcname=os.path.basename(file))
                os.remove(file)

        os.rmdir(temp_dir)
        return output_path
