import os
import magic
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ALLOWED_MIME_TYPES = {
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}

# Scan file for security risks before processing
# This is a demo security scanner
# We consider file types (CSV and Excel) and file size (non-empty)

def scan_file(file_path):
    file_type = magic.Magic(mime=True).from_file(file_path)

    if file_type not in ALLOWED_MIME_TYPES:
        logger.error(f"File type {file_type} is not allowed")
        raise ValueError(f"File type {file_type} is not allowed")

    if os.stat(file_path).st_size == 0:
        logger.error("File is empty")
        raise ValueError("File is empty")

    logger.info(f"Security check passed for {file_path}")