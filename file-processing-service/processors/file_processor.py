import logging
import json
import asyncio
from config.nats_client import NatsClient
from config.minio_client import MinioClient
from config import configs
from processors.security_scanner import scan_file
from processors.file_cleaner import clean_file

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FileProcessor:
    def __init__(
        self,
        nats_client: NatsClient,
        minio_client: MinioClient
    ):
        self.nats_client = nats_client
        self.minio_client = minio_client
        self.websocket_url = configs.WEBSOCKET_URL

    async def process_event(self, msg):

        logger.info("===============NEW MESSAGE=================")
        logger.info(msg.data.decode())

        file_metadata = json.loads(msg.data.decode())

        file_id = file_metadata["id"]
        object_name = file_metadata["objectName"]

        logger.info(f"Processing file with ID: {file_id}")

        local_path = f"/tmp/{object_name}"
        self.minio_client.download_file(object_name, local_path)

        try:
            # Security scan
            self.scan_file(local_path)

            # Process file
            output_path = f"/tmp/processed-{object_name}"
            self.process_file(local_path, output_path)

            # Upload cleaned file back to MinIO in processed bucket
            self.minio_client.upload_file(
                configs.MINIO_PROCESSED_BUCKET, output_path, object_name
            )

            # Publish processing completion event
            await self.nats_client.publish(
                configs.NATS_PROCESSING_SUBJECT,
                json.dumps({"fileId": file_id, "status": "processed"}),
            )

            # Stream and storage cleanup
            try:
                # Acknowledge and remove the message from the stream
                await msg.ack()
                logger.info(
                    f"Message {msg.sid} acknowledged and removed from the stream."
                )

                # Delete the original file from MinIO
                self.minio_client.delete_file(object_name)
            except Exception as e:
                logger.error(f"Error deleting file {object_name}: {e}")

        except Exception as e:
            logger.error(f"Error processing {object_name}: {e}")

    def scan_file(self, file_path):
        scan_file(file_path)

    def process_file(self, input_path, output_path):
        clean_file(input_path, output_path)
