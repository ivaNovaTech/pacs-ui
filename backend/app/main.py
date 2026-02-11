from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import patient
from app.routes import study  

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