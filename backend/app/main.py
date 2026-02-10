from fastapi import FastAPI
from app.routes import patient
from app.routes import study  

app = FastAPI(title="PACS API")

@app.get("/")
def root():
    return {"message": "PACS API is online"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# All hierarchical routes are now under /api/patients
app.include_router(patient.router, prefix="/api")
app.include_router(study.router, prefix="/api")