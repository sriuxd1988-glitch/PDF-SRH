import pikepdf
import logging

logger = logging.getLogger("ToolSecurity")

def protect_pdf(input_path: str, output_path: str, user_password: str, owner_password: str = None) -> str:
    """
    Encrypts a PDF with standard 256-bit AES encryption using pikepdf.
    MPL 2.0 permissive license.
    """
    owner_pwd = owner_password or user_password

    with pikepdf.open(input_path) as pdf:
        encryption = pikepdf.Encryption(
            user=user_password,
            owner=owner_pwd,
            R=6, # 256-bit AES encryption (PDF 2.0 / Acrobat X standard)
            allow=pikepdf.Permissions(extract=False, modify_annotation=False),
        )
        pdf.save(output_path, encryption=encryption, linearize=True)

    return output_path

def unlock_pdf(input_path: str, output_path: str, password: str) -> str:
    """
    Decrypts a password-protected PDF and saves it unencrypted.
    MPL 2.0 permissive license.
    """
    with pikepdf.open(input_path, password=password) as pdf:
        pdf.save(output_path, linearize=True)

    return output_path
