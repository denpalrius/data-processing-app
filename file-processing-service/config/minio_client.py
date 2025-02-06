from minio import Minio
import logging
from config import configs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MinioClient:
    def __init__(self):
        self.client = None

    async def connect(self):
        try:
            self.client = Minio(
                f"{configs.MINIO_ENDPOINT}:{configs.MINIO_PORT}",
                access_key=configs.MINIO_ACCESS_KEY,
                secret_key=configs.MINIO_SECRET_KEY,
                secure=configs.MINIO_USE_SSL.lower() == "true",
            )

            # Check if the connection is successful by listing buckets
            self.client.list_buckets()
            logger.info("Successfully connected to MinIO")
            await self.ensure_buckets_exist()
        except Exception as e:
            logger.error(f"Failed to connect to MinIO: {e}")
            raise

    async def ensure_buckets_exist(self):
        try:
            existing_buckets = [bucket.name for bucket in self.client.list_buckets()]

            if configs.MINIO_STAGING_BUCKET not in existing_buckets:
                self.client.make_bucket(configs.MINIO_STAGING_BUCKET)
                logger.info(f"Created bucket: {configs.MINIO_STAGING_BUCKET}")
            else:
                logger.info(f"Bucket already exists: {configs.MINIO_STAGING_BUCKET}")

            if configs.MINIO_PROCESSED_BUCKET not in existing_buckets:
                self.client.make_bucket(configs.MINIO_PROCESSED_BUCKET)
                logger.info(f"Created bucket: {configs.MINIO_PROCESSED_BUCKET}")
            else:
                logger.info(f"Bucket already exists: {configs.MINIO_PROCESSED_BUCKET}")
        except Exception as e:
            logger.error(f"Failed to ensure buckets exist: {e}")
            raise

    def download_file(self, object_name, local_path):
        try:
            self.client.fget_object(
                configs.MINIO_STAGING_BUCKET, object_name, local_path
            )
            logger.info(f"Successfully downloaded {object_name} to {local_path}")
        except Exception as e:
            logger.error(f"Failed to download {object_name}: {e}")
            raise

    def upload_file(self, bucketName, local_path, object_name):
        try:
            self.client.fput_object(bucketName, object_name, local_path)
            logger.info(f"Successfully uploaded {local_path} as {object_name}")
        except Exception as e:
            logger.error(f"Failed to upload {local_path}: {e}")
            raise

    def delete_file(self, object_name):
        try:
            self.client.remove_object(configs.MINIO_STAGING_BUCKET, object_name)
            logger.info(f"Successfully deleted {object_name}")
        except Exception as e:
            logger.error(f"Failed to delete {object_name}: {e}")
            raise
