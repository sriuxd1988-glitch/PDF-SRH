from PIL import Image
import logging
from typing import List

logger = logging.getLogger("ToolImagesToPdf")

def convert_images_to_pdf(image_paths: List[str], output_pdf_path: str) -> str:
    """
    Combines one or more image files into a clean PDF using Pillow.
    HPND permissive license.
    """
    images = []
    for path in image_paths:
        img = Image.open(path)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        images.append(img)

    if not images:
        raise ValueError("No valid images provided for PDF conversion")

    first_image = images[0]
    rest_images = images[1:]

    first_image.save(output_pdf_path, save_all=True, append_images=rest_images)
    return output_pdf_path
