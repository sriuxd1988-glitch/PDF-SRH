import subprocess
import pikepdf
import logging
import os

logger = logging.getLogger("ToolCompress")

def compress_pdf(input_path: str, output_path: str, level: str = "medium") -> str:
    """
    Compresses PDF using pikepdf object stream compaction and qpdf linearize.
    Zero AGPL code. Permissive MPL 2.0 / Apache 2.0.
    """
    temp_compact = f"{output_path}.temp.pdf"

    # Step 1: Open with pikepdf and re-compress streams
    with pikepdf.open(input_path) as pdf:
        pdf.save(
            temp_compact,
            compress_streams=True,
            object_stream_mode=pikepdf.ObjectStreamMode.generate,
            linearize=True,
        )

    # Step 2: Use qpdf to optimize images and remove unreferenced resources
    try:
        subprocess.run(
            [
                "qpdf",
                "--linearize",
                "--optimize-images",
                "--recompress-flate",
                temp_compact,
                output_path,
            ],
            check=True,
            capture_output=True,
        )
        if os.path.exists(temp_compact):
            os.remove(temp_compact)
    except Exception as e:
        logger.warning(f"qpdf optimization fallback to pikepdf: {e}")
        os.rename(temp_compact, output_path)

    return output_path
