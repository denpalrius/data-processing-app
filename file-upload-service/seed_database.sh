#!/bin/bash

# Wait for PostgreSQL to start (this will depend on your container's startup time)
echo "Waiting for PostgreSQL to start..."
until psql -h localhost -U admin -d postgres -c '\q' 2>/dev/null; do
  sleep 1
done
echo "PostgreSQL is up and running!"

# Create the database if it doesn't exist
echo "Creating database 'file_processor' if it doesn't exist..."
psql -h localhost -U admin -d postgres <<EOF
CREATE DATABASE file_processor;
EOF

# Wait for the new database to be created before connecting
until psql -h localhost -U admin -d file_processor -c '\q' 2>/dev/null; do
  sleep 1
done
echo "Database 'file_processor' is ready!"

# Create the 'files' table if it doesn't exist
echo "Creating 'files' table if it doesn't exist..."
psql -h localhost -U admin -d file_processor <<EOF
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255),
  size INT,
  content_type VARCHAR(255)
);
EOF

# Seed the database with 3 records in the 'files' table
echo "Seeding 'files' table..."
psql -h localhost -U admin -d file_processor <<EOF
INSERT INTO files (filename, size, content_type) VALUES
  ('file1.txt', 1024, 'text/plain'),
  ('file2.jpg', 2048, 'image/jpeg'),
  ('file3.pdf', 5120, 'application/pdf');
EOF

echo "Seeding completed successfully!"


# docker exec -it postgres bash
# bash /docker-entrypoint-initdb.d/seed_database.sh

