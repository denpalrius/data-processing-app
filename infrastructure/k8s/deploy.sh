#!/bin/bash

echo "--- 🚀 Deploying Kubernetes resources ---"

# Apply the Kubernetes deployment
kubectl apply -f deployment.yaml

echo "--- ✅ Kubernetes resources deployed successfully ---"