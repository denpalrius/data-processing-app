FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure Python output is sent straight to terminal
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["python", "websocket_server.py"]
