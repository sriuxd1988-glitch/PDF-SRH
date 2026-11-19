import os
import sys
import unittest
import tempfile
from PIL import Image

# Add src to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "src")))

from tools.images_to_pdf import convert_images_to_pdf
from tools.merge import merge_pdfs
from tools.split import split_pdf
from tools.organize import organize_pdf
from tools.security import protect_pdf, unlock_pdf
from tools.compress import compress_pdf
from tools.esign import apply_esign
from tools.redact import redact_pdf

class TestPermissivePDFTools(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()

    def tearDown(self):
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def _create_sample_pdf(self, filename: str, num_pages: int = 2) -> str:
        """Helper to create a valid test PDF using PIL images."""
        img_paths = []
        for i in range(num_pages):
            img = Image.new("RGB", (200, 200), color=(100 + i * 40, 120, 200))
            path = os.path.join(self.temp_dir, f"test_img_{i}.png")
            img.save(path)
            img_paths.append(path)

        pdf_path = os.path.join(self.temp_dir, filename)
        convert_images_to_pdf(img_paths, pdf_path)
        return pdf_path

    def test_merge_pdfs(self):
        pdf1 = self._create_sample_pdf("doc1.pdf", num_pages=2)
        pdf2 = self._create_sample_pdf("doc2.pdf", num_pages=3)
        merged_out = os.path.join(self.temp_dir, "merged.pdf")

        result = merge_pdfs([pdf1, pdf2], merged_out)
        self.assertTrue(os.path.exists(result))
        self.assertGreater(os.path.getsize(result), 0)

        # Check page count via pikepdf
        import pikepdf
        with pikepdf.open(result) as pdf:
            self.assertEqual(len(pdf.pages), 5)

    def test_split_pdf(self):
        src_pdf = self._create_sample_pdf("doc_split.pdf", num_pages=4)
        split_out = os.path.join(self.temp_dir, "extracted_pages.pdf")

        # Extract pages 1 and 3
        result = split_pdf(src_pdf, split_out, page_ranges=[1, 3])
        self.assertTrue(os.path.exists(result))

        import pikepdf
        with pikepdf.open(result) as pdf:
            self.assertEqual(len(pdf.pages), 2)

    def test_organize_pdf(self):
        src_pdf = self._create_sample_pdf("doc_organize.pdf", num_pages=3)
        org_out = os.path.join(self.temp_dir, "organized.pdf")

        # Rotate page 1 by 90 deg, delete page 2
        result = organize_pdf(src_pdf, org_out, rotations={"1": 90}, delete_pages=[2])
        self.assertTrue(os.path.exists(result))

        import pikepdf
        with pikepdf.open(result) as pdf:
            self.assertEqual(len(pdf.pages), 2)
            self.assertEqual(int(pdf.pages[0].get("/Rotate", 0)), 90)

    def test_images_to_pdf(self):
        img_path = os.path.join(self.temp_dir, "single.jpg")
        img = Image.new("RGB", (300, 300), color="purple")
        img.save(img_path)

        pdf_out = os.path.join(self.temp_dir, "from_img.pdf")
        convert_images_to_pdf([img_path], pdf_out)
        self.assertTrue(os.path.exists(pdf_out))
        self.assertGreater(os.path.getsize(pdf_out), 0)

    def test_protect_and_unlock(self):
        src_pdf = self._create_sample_pdf("doc_protect.pdf", num_pages=2)
        encrypted_out = os.path.join(self.temp_dir, "encrypted.pdf")
        unlocked_out = os.path.join(self.temp_dir, "unlocked.pdf")

        # 1. Protect with 256-bit AES password
        protect_pdf(src_pdf, encrypted_out, user_password="SecurePassword2026")
        self.assertTrue(os.path.exists(encrypted_out))

        import pikepdf
        # Verify opening without password raises PasswordError
        with self.assertRaises(pikepdf.PasswordError):
            with pikepdf.open(encrypted_out) as p:
                _ = len(p.pages)

        # 2. Unlock with password
        unlock_pdf(encrypted_out, unlocked_out, password="SecurePassword2026")
        self.assertTrue(os.path.exists(unlocked_out))

        # Verify unlocked can be read freely
        with pikepdf.open(unlocked_out) as p:
            self.assertEqual(len(p.pages), 2)

    def test_compress_pdf(self):
        src_pdf = self._create_sample_pdf("doc_compress.pdf", num_pages=3)
        compressed_out = os.path.join(self.temp_dir, "compressed.pdf")

        result = compress_pdf(src_pdf, compressed_out, level="basic")
        self.assertTrue(os.path.exists(result))
        self.assertGreater(os.path.getsize(result), 0)

    def test_esign_with_audit_certificate(self):
        src_pdf = self._create_sample_pdf("contract.pdf", num_pages=2)
        signed_out = os.path.join(self.temp_dir, "signed_contract.pdf")

        # Create sample signature PNG
        sig_png = os.path.join(self.temp_dir, "sig.png")
        sig_img = Image.new("RGBA", (150, 60), color=(0, 0, 0, 0))
        sig_img.save(sig_png)

        # Apply e-signature
        result = apply_esign(src_pdf, signed_out, sig_png, page_number=1, signer_info="John Doe (Verified)")
        self.assertTrue(os.path.exists(result))

        # Check that page count increased by 1 (the appended cryptographic audit certificate)
        import pikepdf
        with pikepdf.open(result) as pdf:
            self.assertEqual(len(pdf.pages), 3)

    def test_redact_pdf(self):
        src_pdf = self._create_sample_pdf("confidential.pdf", num_pages=2)
        redacted_out = os.path.join(self.temp_dir, "redacted.pdf")

        result = redact_pdf(
            src_pdf,
            redacted_out,
            redaction_areas=[{"page": 1, "x": 50, "y": 100, "width": 100, "height": 30}]
        )
        self.assertTrue(os.path.exists(result))

        import pikepdf
        with pikepdf.open(result) as pdf:
            # Metadata must be stripped
            self.assertFalse(hasattr(pdf.Root, "Metadata") and pdf.Root.Metadata is not None)
            # Annotation rectangle must exist
            self.assertIn("/Annots", pdf.pages[0])

if __name__ == "__main__":
    unittest.main()
