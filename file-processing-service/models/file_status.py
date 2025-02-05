from datetime import datetime
from enum import Enum


class FileStatus(Enum):
    UPLOADING = "uploading"
    STAGED = "staged"
    PROCESSED = "processed"
    ERROR = "error"
