import logging
import asyncio
from config.nats_client import NatsClient
from config.minio_client import MinioClient
from processors.file_processor import FileProcessor
from config import configs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    nats_client = NatsClient()
    await nats_client.connect()

    minio_client = MinioClient()
    await minio_client.connect()

    file_processor = FileProcessor(nats_client, minio_client)
    await nats_client.subscribe(configs.NATS_STAGED_SUBJECT, file_processor.process_event)

    logger.info("=====Waiting for file upload events=====\n")
    await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())