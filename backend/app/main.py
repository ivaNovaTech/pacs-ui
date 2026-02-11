from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import patient
from app.routes import study  
import os


app = FastAPI(title="PACS API")

# Necessary for Angular to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "PACS API is online"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# All hierarchical routes are now under /api/patients and /api/studies
app.include_router(patient.router, prefix="/api")
app.include_router(study.router, prefix="/api")


# Get the directory where main.py actually lives (/backend/app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Mount using the absolute path
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Mount the static folder
#Makes sample DICOM files available at: https://pacs-api.ivanova.tech/static/samples/ct_sample.dcm
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")