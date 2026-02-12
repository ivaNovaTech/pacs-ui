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

# 2. LOAD variables using source (handles your double quotes correctly)
echo "📂 Loading variables from $ENV_FILE"
set -a
source "$ENV_FILE"
set +a

# 3. Unique tag and Path construction
TAG="latest-$(date +%s)" 
FRONT_PATH="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME_FRONT}:${TAG}"

echo "🚀 Offloading FRONTEND BUILD to Google Cloud Build"
echo "Target: $FRONT_PATH"

# 4. Determine Context (Are we in frontend/ or root?)
if [[ "$PWD" == *"/frontend" ]]; then 
    CONTEXT_DIR="."
else 
    CONTEXT_DIR="./frontend"
fi

# 5. Execute Remote Build
# This handles the heavy Angular compilation on Google's hardware
gcloud builds submit --tag "$FRONT_PATH" "$CONTEXT_DIR" || exit 1

echo "☸️ Patching GKE Frontend Deployment..."

# 6. Update GKE
# NOTE: 'pacs-ui' must match the 'name:' field of the container in your YAML
kubectl set image deployment/pacs-frontend pacs-ui="$FRONT_PATH"

echo "⏳ Waiting for rollout..."
kubectl rollout status deployment/pacs-frontend

echo "✅ IVANOVA PACS Frontend updated to $TAG on GKE"