#!/bin/bash
# Unique tag based on Unix timestamp
TAG="latest-$(date +%s)" 
FULL_IMAGE_PATH="us-central1-docker.pkg.dev/mwakilishi-1770258957/pacs-repo/pacs-backend:$TAG"

echo "🚀 Offloading BUILD to Google Cloud Build (Unique tag: $TAG)"

# 1. Build & Push REMOTELY (Bypasses the 2GB node limit)
gcloud builds submit --tag $FULL_IMAGE_PATH . || exit 1

echo "☸️ Patching GKE Backend Deployment..."

# 2. Update the Backend Deployment
kubectl set image deployment/pacs-backend pacs-api=$FULL_IMAGE_PATH

# 3. Check status
kubectl rollout status deployment/pacs-backend

echo "✅ Backend updated to $TAG on GKE"