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

# --- THE FIX ---
# Instead of copying the whole backend folder, 
# copy ONLY the contents of your 'app' folder into '/app'
COPY ./app /app

# Set PYTHONPATH to the root /app so imports like 'from routes import ...' work
ENV PYTHONPATH=/app

# This will now be: /app/static/samples/sample_us.dcm
RUN ls -l /app/static/samples/sample_us.dcm

EXPOSE 8000

# Since we flattened the structure, main.py is now in the root /app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]