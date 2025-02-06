# Dockerfile
FROM python:3.11-slim


WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Ensure Python output is sent straight to terminal
ENV PYTHONUNBUFFERED=1

# Expose the correct port
EXPOSE 8080

CMD ["python", "websocket_server.py"]
