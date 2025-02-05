import asyncio
import nats
import logging
from config import configs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class NatsClient:
    def __init__(self):
        self.nc = None
        self.js = None

    async def connect(self):
        try:
            self.nc = await nats.connect(configs.NATS_SERVERS)
            self.js = self.nc.jetstream()
            logger.info("Successfully connected to NATS")
            await self.create_streams()
        except Exception as e:
            logger.error(f"Failed to connect to NATS: {e}")
            raise

    async def create_streams(self):
        try:
            # Create the stream if it doesn't exist
            await self.js.add_stream(name="FILE_UPLOADS", subjects=["file.upload.*"])
            await self.js.add_stream(
                name="FILE_PROCESSING", subjects=["file.processing.*"]
            )
            logger.info("Successfully created or verified streams")
        except Exception as e:
            if "stream name already in use" in str(e):
                logger.info("Streams already exist, skipping creation")
            else:
                logger.error(f"Failed to create streams: {e}")
                raise

    async def subscribe(self, subject, callback):
        try:
            await self.js.subscribe(subject, cb=callback)
            logger.info(f"Successfully subscribed to {subject}")
        except Exception as e:
            logger.error(f"Failed to subscribe to {subject}: {e}")
            raise

    async def publish(self, subject, data):
        try:
            await self.js.publish(subject, data.encode())
            logger.info(f"Successfully published to {subject}")
        except Exception as e:
            logger.error(f"Failed to publish to {subject}: {e}")
            raise

    async def manual_ack(self, msg):
        try:
            await msg.ack()
            logger.info(f"Manually acknowledged and removed message from stream")
        except Exception as e:
            logger.error(f"Failed to manually acknowledge message: {e}")
            raise

    async def close(self):
        try:
            await self.nc.drain()
            logger.info("Successfully disconnected from NATS")
        except Exception as e:
            logger.error(f"Failed to disconnect from NATS: {e}")
            raise
