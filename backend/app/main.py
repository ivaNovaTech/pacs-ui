import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import your route modules
# Ensure 'health' is the filename created above
from routes import patient, study, system, health

app = FastAPI(
    title="IvaNova PACS API",
    root_path="",     
    docs_url="/api/docs",      
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "PACS API is online", "version": "1.2-beta"}

# --- ROUTER REGISTRATION ---
app.include_router(patient.router, prefix="/api", tags=["patients"])
app.include_router(study.router, prefix="/api", tags=["studies"])
app.include_router(system.router, prefix="/api", tags=["system"])


# --- STATIC FILES ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")