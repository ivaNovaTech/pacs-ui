FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend folder into /src
COPY . .

# Critical: This ensures 'import app' works from the /src directory
ENV PYTHONPATH=/src

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]