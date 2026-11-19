"""
PDF Test Corpus Generator for SimplifyPDF
Generates specialized PDF test documents covering edge cases:
- Multi-page pagination
- Unicode & Multilingual (Hindi, Arabic, Japanese, English)
- High-resolution scanned raster
- Password-encrypted documents
- Pre-existing watermarks and metadata
Powered strictly by permissive Pillow and pikepdf (Zero-AGPL).
"""

import os
import tempfile
from PIL import Image, ImageDraw
import pikepdf

CORPUS_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(CORPUS_DIR, exist_ok=True)

def create_sample_pages(num_pages=3, color=(134, 79, 254)):
    images = []
    for i in range(num_pages):
        img = Image.new("RGB", (600, 800), color=(250, 249, 247))
        draw = ImageDraw.Draw(img)
        # Draw header banner
        draw.rectangle([0, 0, 600, 100], fill=color)
        draw.text((30, 40), f"SimplifyPDF Test Corpus - Page {i+1}", fill=(255, 255, 255))
        draw.text((30, 150), f"Unique Content Identifier: CORPUS-PAGE-{i+1}-{num_pages}", fill=(17, 20, 29))
        draw.text((30, 180), "Zero-AGPL Permissive Engines: pypdfium2, pikepdf, qpdf, pdf2docx", fill=(113, 113, 122))
        images.append(img)
    return images

def generate_corpus():
    print("📦 Generating PDF Test Corpus...")

    # 1. Standard Document
    standard_path = os.path.join(CORPUS_DIR, "standard_document.pdf")
    pages = create_sample_pages(2)
    pages[0].save(standard_path, save_all=True, append_images=pages[1:])
    print(f"   [1/6] Created: {os.path.basename(standard_path)}")

    # 2. Multi-Page Document (10 pages)
    multipage_path = os.path.join(CORPUS_DIR, "multipage_book.pdf")
    pages10 = create_sample_pages(10, color=(26, 26, 28))
    pages10[0].save(multipage_path, save_all=True, append_images=pages10[1:])
    print(f"   [2/6] Created: {os.path.basename(multipage_path)}")

    # 3. Password-Encrypted Document
    encrypted_path = os.path.join(CORPUS_DIR, "encrypted_secure.pdf")
    with pikepdf.open(standard_path) as pdf:
        enc = pikepdf.Encryption(owner="owner123", user="pass123", R=6)
        pdf.save(encrypted_path, encryption=enc)
    print(f"   [3/6] Created: {os.path.basename(encrypted_path)} (Password: pass123)")

    # 4. Multilingual & Unicode Document
    unicode_path = os.path.join(CORPUS_DIR, "unicode_multilingual.pdf")
    u_img = Image.new("RGB", (600, 800), color=(255, 255, 255))
    u_draw = ImageDraw.Draw(u_img)
    u_draw.rectangle([0, 0, 600, 80], fill=(134, 79, 254))
    u_draw.text((30, 30), "SimplifyPDF Global Multilingual Test", fill=(255, 255, 255))
    u_draw.text((30, 120), "English: High-performance PDF processing platform", fill=(0, 0, 0))
    u_draw.text((30, 150), "Hindi: सरल और सुरक्षित पीडीएफ उपकरण", fill=(0, 0, 0))
    u_draw.text((30, 180), "Japanese: 高速で安全なPDF処理ツール", fill=(0, 0, 0))
    u_draw.text((30, 210), "Arabic: أدوات بي دي إف سريعة وآمنة", fill=(0, 0, 0))
    u_img.save(unicode_path)
    print(f"   [4/6] Created: {os.path.basename(unicode_path)}")

    # 5. High-DPI Scanned Form
    scanned_path = os.path.join(CORPUS_DIR, "scanned_form.pdf")
    s_img = Image.new("RGB", (1200, 1600), color=(245, 245, 248))
    s_draw = ImageDraw.Draw(s_img)
    s_draw.rectangle([50, 50, 1150, 200], outline=(100, 100, 100), width=3)
    s_draw.text((80, 80), "OFFICIAL CERTIFIED VERIFICATION FORM", fill=(10, 10, 10))
    s_draw.rectangle([50, 250, 1150, 800], outline=(150, 150, 150), width=2)
    s_img.save(scanned_path, resolution=300.0)
    print(f"   [5/6] Created: {os.path.basename(scanned_path)}")

    # 6. Pre-existing Metadata & Tags Document
    tagged_path = os.path.join(CORPUS_DIR, "tagged_metadata.pdf")
    with pikepdf.open(standard_path) as pdf:
        with pdf.open_metadata() as meta:
            meta["dc:title"] = "Confidential Enterprise Document"
            meta["dc:creator"] = ["SimplifyPDF Test Author"]
            meta["pdf:Keywords"] = "Confidential, Audit, Legal, FinTech"
        pdf.save(tagged_path)
    print(f"   [6/6] Created: {os.path.basename(tagged_path)}")

    print("✅ All 6 core test corpus documents generated successfully in tests/corpus/\n")

if __name__ == "__main__":
    generate_corpus()
