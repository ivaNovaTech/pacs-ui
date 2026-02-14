# --- STAGE 1: BUILDER ---
FROM python:3.11-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /build/wheels -r requirements.txt

# --- STAGE 2: FINAL ---
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install wheels
COPY --from=builder /build/wheels /wheels
RUN pip install --no-cache-dir /wheels/*

# Copy all backend files
COPY . .

# Set PYTHONPATH so 'from routes import ...' works within the app package
# This solves the ModuleNotFoundError for good.
ENV PYTHONPATH=/app/app:/app

# Verification step for static files
RUN ls -l ./app/static/samples/sample_us.dcm

EXPOSE 8000

# Run uvicorn using the module path
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]