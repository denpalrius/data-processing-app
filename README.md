# Data Processing App

This repository contains the code and configuration for a data processing microservice application. The application includes the following services and applications:

- **NATS Server**: A high-performance messaging system.
- **MinIO Server**: An object storage server compatible with Amazon S3.
- **PostgreSQL Database**: A relational database for storing application data.
- **Frontend Application**: A web-based user interface.
- **Python File Processor**: A service for processing files using Python.
- **NestJS Storage Service**: A storage service built with NestJS.
- **FastAPI WebSocket**: A WebSocket server built with FastAPI.

This guide provides instructions on how to run and test the application manually, using Docker Compose, and deploying it to a Kubernetes cluster.

## Prerequisites

- Docker
- Docker Compose
- Kubernetes (kubectl)
- Node.js 22
- Python 3.11.11

## Configuring Environment Variables

Create a `.env` file in the root directory of the project (same directory as the `docker-compose.yml` file) and add the following configuration:

```dotenv
# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=dev123_admin

DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=admin
DATABASE_PASSWORD=dev123_admin
DATABASE_NAME=file_processor

# MinIO
MINIO_ENDPOINT=minio
MINIO_REPLACEMENT_URL=http://localhost:9002 # The one exposed by the host
MINIO_PORT=9000 # The one exposed by the container
MINIO_USE_SSL=false
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=dev123_admin
MINIO_ACCESS_KEY=UpcdoQgnk5Z8liDwyaXp
MINIO_SECRET_KEY=N9WYPZlYUMroTdIsnZwlZQVFTI6pQ5pFi55kC9UD
MINIO_STAGING_BUCKET=staging
MINIO_PROCESSED_BUCKET=processed

# NATS
NATS_SERVERS=nats://nats:4222
NATS_STAGED_SUBJECT=file.upload.completed
NATS_PROCESSED_SUBJECT=file.processing.completed

# SSE
SSE_EVENTS_URL=http://sse-server:8081/events
SSE_BROADCAST_URL=http://sse-server:8081/broadcast

# File Upload Service
LOGGER_LEVEL=log
```

## Running the Application with Docker Compose

1. Navigate to the root directory of the project.
2. Run the following command to start the services:

```bash
docker-compose up
```

This command will start all the services as defined in the `docker-compose.yml` file.

## Running the Application with Kubernetes [*not ready for use]

To deploy the application to a Kubernetes cluster, follow these steps:

1. Ensure your Kubernetes cluster is up and running.
2. Apply the Kubernetes manifest:

```bash
kubectl apply -f ./infrastructure/k8s/deployment.yaml
```

Alternatively, you can use the provided `deploy.sh` script to apply the manifest:

```bash
./infrastructure/k8s/deploy.sh
```

## Testing the Application

Open your browser and navigate to `http://localhost:81`. You should see the frontend application and be able to interact with it.

Different layers of restrictions have been placed for file/mime types from the frontend, the upload service, and the processing service.
For preview, use either a `CSV` or `Excel` file.

### Testing with a Tabular CSV File

To test the application with a tabular CSV file, follow these steps:

1. Prepare a tabular CSV file. See sample structure below:

```csv
id,name,age,email
1,John Doe,30,john.doe@example.com
2,Jane Smith,25,jane.smith@example.com
3,Bob Johnson,40,bob.johnson@example.com
```

You can find sample CSV files from the Florida State University [CSV archive](https://people.sc.fsu.edu/~jburkardt/data/csv/csv.html).

2. Open the frontend application in your browser at `http://localhost:81`.
3. Use the file upload feature to upload the prepared CSV file.
4. Monitor the logs of the `file-upload-service` and `file-processing-service` to ensure the file is processed correctly.

> For quick prototyping, most of the secrets are in plain text and included with the config files. An ideal situation would be to use a secret store to store and retrieve them.

## Cleaning Up

To stop and remove the Docker Compose services, run the following command:

```bash
docker-compose down
```

To delete the Kubernetes resources, run the following command:

```bash
kubectl delete -f infrastructure/k8s-deployment.yaml
```

## Troubleshooting

If you encounter any issues, check the logs of the respective services for more information. You can view the logs using the following commands:

- Docker Compose:

```bash
docker-compose logs
```

- Kubernetes:

```bash
kubectl logs <pod-name>
```
