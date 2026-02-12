#!/bin/bash
TAG="latest-$(date +%s)" 
FULL_IMAGE_PATH="us-central1-docker.pkg.dev/mwakilishi-1770258957/pacs-repo/pacs-frontend:$TAG"

echo "🚀 Building UNIQUE tag via Cloud Build: $TAG"

#Builds are performed on GCP
gcloud builds submit --tag $FULL_IMAGE_PATH . || exit 1
# ----------------------

echo "☸️ Patching GKE..."
kubectl set image deployment/pacs-frontend pacs-ui=$FULL_IMAGE_PATH

echo "⏳ Waiting for rollout..."
kubectl rollout status deployment/pacs-frontend

echo "✅ Frontend updated to $TAG"