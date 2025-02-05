import re
from datetime import datetime
from enum import Enum


class FileMetadata:
    def __init__(
        self,
        id,
        filename,
        size,
        contentType,
        bucketName,
        objectName,
        bucketUrl,
        status,
        createdAt,
        updatedAt,
    ):
        self.id = id
        self.filename = filename
        self.size = size
        self.contentType = contentType
        self.bucketName = bucketName
        self.objectName = objectName
        self.bucketUrl = bucketUrl
        self.status = status
        self.createdAt = createdAt
        self.updatedAt = updatedAt
