# --- STAGE 1: BUILDER (The heavy prep station) ---
FROM python:3.11-slim AS builder

# Install compilers needed for psutil and other dependencies
# This happens in a temporary layer that won't stay in the final image
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY requirements.txt .

# Instead of installing directly, we create "wheels" (binary packages)
# This converts source code into tiny, installable files
RUN pip wheel --no-cache-dir --wheel-dir /build/wheels -r requirements.txt


# --- STAGE 2: FINAL (The clean serving counter) ---
FROM python:3.11-slim

# Install 'curl' in the final stage only if you need it for health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy ONLY the pre-compiled binary wheels from the builder stage
COPY --from=builder /build/wheels /wheels
RUN pip install --no-cache-dir /wheels/*

# Copy application code
COPY ./app .

# Verification step (same as previous version)
RUN ls -l ./static/samples/sample_us.dcm

EXPOSE 8000

# Run from /backend and look for the 'app' package
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]