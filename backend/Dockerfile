FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Set the root to /backend
WORKDIR /backend

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your local 'app' folder into '/backend/app'
# This creates the 'app' module that your code expects
COPY ./app ./app

# Verify the static files are inside the app folder
RUN ls -l ./app/static/samples/sample_us.dcm

EXPOSE 8000

# Tell Uvicorn to run from the /backend directory and look for the app package
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]