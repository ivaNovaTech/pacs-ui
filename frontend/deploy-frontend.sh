#!/bin/bash
TAG="latest-$(date +%s)" # Generates a totally unique tag based on timestamp
FULL_IMAGE_PATH="us-central1-docker.pkg.dev/mwakilishi-1770258957/pacs-repo/pacs-frontend:$TAG"

echo "🚀 Building UNIQUE tag: $TAG"

docker build --no-cache -t $FULL_IMAGE_PATH . || exit 1
docker push $FULL_IMAGE_PATH || exit 1

echo "☸️ Patching GKE..."
kubectl set image deployment/pacs-frontend pacs-ui=$FULL_IMAGE_PATH
kubectl rollout status deployment/pacs-frontend