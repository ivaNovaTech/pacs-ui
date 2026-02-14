#!/bin/bash
set -e

echo "🛑 Cleaning up old containers..."
docker rm -f temp-postgres 2>/dev/null || true

echo "🐘 Step 0 & 1: Starting Ephemeral DB..."
docker run -d --name temp-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=pacs_test \
  -p 5435:5432 \
  postgres:17-alpine

echo "Waiting for Postgres..."
sleep 8

echo "🚀 Step 2 & 3: Running Migrations..."
docker build -t pacs-migrations:test -f backend/migrations/Dockerfile.flyway backend/
docker run --rm \
  -e FLYWAY_URL=jdbc:postgresql://host.docker.internal:5435/pacs_test \
  -e FLYWAY_USER=postgres \
  -e FLYWAY_PASSWORD=password \
  pacs-migrations:test migrate

echo "📦 Step 4: Building Backend..."
docker build -t test-backend -f backend/Dockerfile backend/

echo "🖼️ Step 5: Building Frontend..."
docker build -t test-ui -f frontend/Dockerfile frontend/

echo "✅ ALL STEPS PASSED LOCALLY"
