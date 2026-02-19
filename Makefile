# 1. Load the file
ifneq ("$(wildcard .env)","")
    include .env
    export $(shell sed 's/=.*//' .env)
endif

.PHONY: up down db migrate backend frontend sync-localdb fix-columns dev-setup clean

# --- DOCKER COMPOSE COMMANDS ---

# Start everything (DB, Backend, Frontend) in the background
up:
	@echo "🧹 Cleaning up old container conflicts..."
	-docker rm -f pacs_testdb 2>/dev/null
	@echo "🚀 Starting full stack with Docker Compose..."
	docker compose up -d --build
	@echo "\n✅ Stack is running:"
	@$(MAKE) status

# Stop and remove all containers
down:
	@echo "🛑 Stopping all services..."
	docker compose down

# Show status of project containers
status:
	@echo "📊 Project Status:"
	docker compose ps

# View logs for everything
logs:
	docker compose logs -f

# Real-time resource usage
stats:
	docker stats --no-stream

# --- TARGETED COMMANDS ---

# Start only the database (useful for sync-localdb)
db:
	@echo "🐘 Starting Postgres..."
	docker compose up -d db
	@until docker exec pacs_testdb pg_isready -U postgres; do sleep 1; done
	@echo "✅ DB is ready."

# Run Flyway migrations using the compose network
migrate:
	@echo "🚀 Running Migrations..."
	docker build -t pacs-migrations:test -f backend/migrations/Dockerfile.flyway backend/
	# We run this on the compose network so it can find 'db:5432'
	docker run --rm \
		--network $(shell basename $(CURDIR))_default \
		-e FLYWAY_URL=jdbc:postgresql://db:5432/pacs \
		-e FLYWAY_USER=postgres \
		-e FLYWAY_PASSWORD=password \
		pacs-migrations:test migrate

# Sync data from the physical local server (10.10.10.220)
sync-localdb:
	@echo "📡 Pulling data from $(LOCAL_DB_HOST)..."
	PGPASSWORD=$(LOCAL_DB_PASSWORD) pg_dump -h $(LOCAL_DB_HOST) -p 5432 -U $(LOCAL_DB_USER) -d pacs \
		--clean --if-exists --no-owner --no-privileges --no-publications --no-subscriptions | \
	docker exec -i pacs_testdb psql -U postgres -d pacs
	@echo "✅ Data Synced!"

# Data verification
fix-columns:
	@echo "🔧 Checking data alignment..."
	-docker exec -it pacs_testdb psql -U postgres -d pacs

# The "One-Touch" Developer Setup
dev-setup: db sync-localdb fix-columns
	@echo "🚀 SUCCESS: DB is ready. Run 'make up' to start the application."

# Individual service runs (useful for debugging)
run-backend:
	docker compose up --build pacs-backend-service

run-frontend:
	docker compose up --build pacs-frontend

# Cleanup everything including volumes (fresh start)
clean:
	docker compose down -v
	docker system prune -f --volumes