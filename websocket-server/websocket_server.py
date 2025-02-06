from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import logging
import asyncio

# Set up logging with more detailed format
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients = []


@app.get("/")
async def health_check():
    return {"status": "healthy"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    client_id = f"{websocket.client.host}:{websocket.client.port}"
    logger.info(f"Client connected: {client_id}")
    connected_clients.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received message from {client_id}: {data}")
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        logger.info(f"Client disconnected: {client_id}")
        connected_clients.remove(websocket)


async def send_periodic_updates():
    while True:
        if connected_clients:
            for client in connected_clients:
                try:
                    await client.send_text(
                        '{"type": "UPLOAD_STATUS", "status": "processing"}'
                    )
                except Exception as e:
                    logger.error(f"Error sending message to client: {e}")
        await asyncio.sleep(5)


if __name__ == "__main__":
    import uvicorn

    loop = asyncio.get_event_loop()
    loop.create_task(send_periodic_updates())
    uvicorn.run(app, host="0.0.0.0", port=8080)
