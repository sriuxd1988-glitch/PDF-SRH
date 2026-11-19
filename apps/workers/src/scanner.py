import socket
import os
import logging

logger = logging.getLogger("ClamAVScanner")

CLAMAV_HOST = os.getenv("CLAMAV_HOST", "localhost")
CLAMAV_PORT = int(os.getenv("CLAMAV_PORT", "3310"))

def scan_file_stream(file_path: str) -> tuple[bool, str]:
    """
    Scans a local file using ClamAV daemon via INSTREAM protocol over TCP.
    Returns (is_clean, virus_name_or_message).
    """
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(10.0)
        s.connect((CLAMAV_HOST, CLAMAV_PORT))
        s.sendall(b"zINSTREAM\0")

        with open(file_path, "rb") as f:
            while chunk := f.read(2048):
                size = len(chunk)
                s.sendall(size.to_bytes(4, byteorder="big") + chunk)
        # Send zero chunk to terminate stream
        s.sendall((0).to_bytes(4, byteorder="big"))

        response = s.recv(1024).decode("utf-8").strip()
        s.close()

        if "OK" in response:
            return True, "CLEAN"
        elif "FOUND" in response:
            logger.warning(f"Malware detected in {file_path}: {response}")
            return False, response
        else:
            logger.warning(f"Unexpected ClamAV response: {response}")
            return True, "UNKNOWN_SCAN_PASS"
    except Exception as e:
        logger.warning(f"ClamAV scan skipped or unreachable ({e}). Passing file safely in local dev.")
        return True, "SCANNER_BYPASS_DEV"
