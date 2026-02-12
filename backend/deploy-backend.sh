#!/bin/bash

# 1. SMART SEARCH for .env
if [ -f .env ]; then
    ENV_FILE=".env"
elif [ -f ../.env ]; then
    ENV_FILE="../.env"
else
    echo "❌ .env file not found in current or parent directory! Script aborted."
    exit 1
fi

# 2. LOAD variables using source (handles quotes correctly)
echo "📂 Loading variables from $ENV_FILE"
set -a
source "$ENV_FILE"
set +a

# 3. Unique tag and Path construction
TAG="latest-$(date +%s)" 
BACK_PATH="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME_BACK}:${TAG}"

echo "🚀 Offloading BACKEND BUILD to Google Cloud Build"
echo "Target: $BACK_PATH"

# 4. Determine Context (Are we in backend/ or root?)
if [[ "$PWD" == *"/backend" ]]; then 
    CONTEXT_DIR="."
else 
    CONTEXT_DIR="./backend"
fi

# 5. Execute Remote Build
# This sends the code to GCP so your Mac doesn't have to do the heavy lifting
gcloud builds submit --tag "$BACK_PATH" "$CONTEXT_DIR" || exit 1

echo "☸️ Patching GKE Backend Deployment..."

# 6. Update GKE
# Ensure 'pacs-api' matches the container name in your deployment yaml
kubectl set image deployment/pacs-backend pacs-api="$BACK_PATH"

echo "⏳ Waiting for rollout..."
kubectl rollout status deployment/pacs-backend

echo "✅ IVANOVA PACS Backend updated to $TAG on GKE"