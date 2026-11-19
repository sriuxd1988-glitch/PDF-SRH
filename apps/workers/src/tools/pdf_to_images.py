import pypdfium2 as pdfium
import zipfile
import os
import logging

logger = logging.getLogger("ToolPdfToImages")

def convert_pdf_to_images(input_path: str, output_zip_path: str, dpi: int = 150, format: str = "jpeg") -> str:
    """
    Renders each PDF page as an image using pypdfium2 and bundles into a ZIP.
    Zero AGPL. BSD-3-Clause / Apache 2.0.
    """
    pdf = pdfium.PdfDocument(input_path)
    scale = dpi / 72.0  # PDF standard is 72 dpi

    temp_dir = f"{output_zip_path}_imgs"
    os.makedirs(temp_dir, exist_ok=True)
    generated_images = []

    for i in range(len(pdf)):
        page = pdf[i]
        image = page.render(scale=scale).to_pil()
        img_name = f"page_{i + 1:03d}.{format}"
        img_path = os.path.join(temp_dir, img_name)
        image.save(img_path, quality=90)
        generated_images.append(img_path)

    with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for img in generated_images:
            zipf.write(img, arcname=os.path.basename(img))
            os.remove(img)

    os.rmdir(temp_dir)
    return output_zip_path
