# 1. Load the file
ifneq ("$(wildcard .env)","")
    include .env
    export $(shell sed 's/=.*//' .env)
endif

# Variables
DB_URL=postgresql://postgres:password@host.docker.internal:5435/pacs
FLYWAY_URL=jdbc:postgresql://host.docker.internal:5435/pacs

.PHONY: db migrate backend frontend test clean deploy sync-localdb fix-columns run-backend run-frontend dev-setup

# Start the local test database
db:
	@echo "🐘 Starting Postgres..."
	-docker rm -f temp-postgres 2>/dev/null
	docker run -d --name temp-postgres \
		-e POSTGRES_PASSWORD=password \
		-e POSTGRES_DB=pacs \
		-p 5435:5432 \
		postgres:17-alpine
	@echo "Waiting for DB..."
	@sleep 5

# Run Flyway migrations
migrate:
	@echo "🚀 Running Migrations..."
	docker build -t pacs-migrations:test -f backend/migrations/Dockerfile.flyway backend/
	docker run --rm \
		-e FLYWAY_URL=$(FLYWAY_URL) \
		-e FLYWAY_USER=postgres \
		-e FLYWAY_PASSWORD=password \
		pacs-migrations:test migrate

# Build only the Backend
backend:
	@echo "📦 Building Backend..."
	docker build -t test-backend -f backend/Dockerfile backend/

# Build only the Frontend
frontend:
	@echo "🎨 Building Frontend..."
	docker build -t test-ui ./frontend

# Sync data from the physical local server (10.10.10.220)
sync-localdb:
	@echo "📡 Pulling data from $(LOCAL_DB_HOST)..."
	PGPASSWORD=$(LOCAL_DB_PASSWORD) pg_dump -h $(LOCAL_DB_HOST) -p 5432 -U $(LOCAL_DB_USER) -d pacs \
		--clean --if-exists --no-owner --no-privileges --no-publications --no-subscriptions | \
	docker exec -i temp-postgres psql -U postgres -d pacs
	@echo "✅ Data Synced!"

# Left alone - Data is now correct at source
fix-columns:
	@echo "🔧 Checking data alignment..."
	-docker exec -it temp-postgres psql -U postgres -d pacs

# The "One-Touch" Developer Setup
dev-setup: db sync-localdb fix-columns
	@echo "🚀 SUCCESS: DB is ready. Run 'make run-backend' then 'make run-frontend'"

# Run Backend
run-backend:
	docker run --rm -it \
		--name running-backend \
		-p 8000:8000 \
		--add-host=host.docker.internal:host-gateway \
		-e DATABASE_URL=$(DB_URL) \
		test-backend

# Run Frontend - NO trailing slash on BACKEND_URL
run-frontend:
	docker run --rm -it \
		--name running-ui \
		-p 80:80 \
		--add-host=host.docker.internal:host-gateway \
		-e BACKEND_URL=http://host.docker.internal:8000 \
		test-ui

# Cleanup
clean:
	docker stop temp-postgres running-backend running-ui || true
	docker rm temp-postgres running-backend running-ui || true