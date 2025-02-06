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

## Running the Application with Docker Compose

1. Navigate to the root directory of the project.
2. Run the following command to start the services:

```bash
docker-compose up -d
```

This command will start all the services as defined in the `docker-compose.yml` file.

## Running the Application with Kubernetes [*not ready for use]

To deploy the application to a Kubernetes cluster, follow these steps:

1. Ensure your Kubernetes cluster is up and running.
2. Apply the Kubernetes manifest:

```bash
kubectl apply -f infrastructure/k8s-deployment.yaml
```

Alternatively, you can use the provided `deploy.sh` script to apply the manifest:

```bash
./infrastructure/deploy.sh
```

## Testing the Application

Open your browser and navigate to `http://localhost:81`. You should see the frontend application and be able to interact with it

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
