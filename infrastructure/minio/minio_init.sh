#!/bin/sh

echo "--- 🪣 Initializing MinIO server ---"

mkdir -p /data

# Start MinIO in background
minio server /data --console-address ":9001" &

# Wait for MinIO to be ready
until mc ready local; do
  sleep 3;
done

# Configure mc
mc config host add myminio http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# Create service account (access keys)
mc admin user svcacct add myminio ${MINIO_ROOT_USER} \
  --access-key  ${MINIO_ACCESS_KEY} \
  --secret-key ${MINIO_SECRET_KEY}

echo "--- ✅ MinIO server initialized successfully ---"

# Keep container running
wait