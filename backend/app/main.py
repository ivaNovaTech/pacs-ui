from fastapi import FastAPI
from app.routes import patient

app = FastAPI(title="PACS API")

@app.get("/")
def root():
    return {"message": "PACS API is online"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# All hierarchical routes are now under /api/patients
app.include_router(patient.router, prefix="/api")