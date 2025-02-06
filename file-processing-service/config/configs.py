import os
from dotenv import load_dotenv

load_dotenv()

NATS_SERVERS = os.getenv("NATS_SERVERS")
NATS_STAGED_SUBJECT = "file.upload.completed"
NATS_PROCESSING_SUBJECT = "file.processing.completed"

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_PORT= os.getenv("MINIO_PORT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_USE_SSL = os.getenv("MINIO_USE_SSL", "false")
MINIO_STAGING_BUCKET = os.getenv("MINIO_STAGING_BUCKET", "staging")
MINIO_PROCESSED_BUCKET = os.getenv("MINIO_PROCESSED_BUCKET", "processed")

WEBSOCKET_URL = os.getenv("WEBSOCKET_URL")