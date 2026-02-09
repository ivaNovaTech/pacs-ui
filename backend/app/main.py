from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth import router as auth_router
from .routes import health, users, patient, study, series, image
from dotenv import load_dotenv
import os

load_dotenv()  

app = FastAPI()

# --- 1. CORS IS MANDATORY FOR ANGULAR ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. THE FIX: NAKED ROUTER INCLUSIONS ---
# If you had "dependencies=[Depends(...)]" here before, that was the lock.
# These are now wide open.
app.include_router(auth_router)
app.include_router(health.router)
app.include_router(users.router)
app.include_router(patient.router)
app.include_router(study.router)
app.include_router(series.router)
app.include_router(image.router)

@app.get("/")
def root():
    return {"message": "fdgdgeg All security is temporarily disabled. If you still see 'Not authenticated', check auth.py for middleware."}