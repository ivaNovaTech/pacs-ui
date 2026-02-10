#!/bin/bash
# Unique tag based on Unix timestamp
TAG="latest-$(date +%s)" 
# Update path to your backend repository
FULL_IMAGE_PATH="us-central1-docker.pkg.dev/mwakilishi-1770258957/pacs-repo/pacs-backend:$TAG"

echo "🚀 Building BACKEND UNIQUE tag: $TAG"

# 1. Build & Push
docker build --no-cache -t $FULL_IMAGE_PATH . || exit 1
docker push $FULL_IMAGE_PATH || exit 1

echo "☸️ Patching GKE Backend Deployment..."

# 2. Update the Backend Deployment (Assuming deployment name is pacs-backend)
kubectl set image deployment/pacs-backend pacs-api=$FULL_IMAGE_PATH

# 3. Check status
kubectl rollout status deployment/pacs-backend

echo "✅ Backend updated to $TAG"