from fastapi import FastAPI
from .auth import router as auth_router
from .routes import health, users, patient, study, series, image
from dotenv import load_dotenv
import os

# load .env into environment variables
load_dotenv()  


app = FastAPI()

app.include_router(auth_router)
app.include_router(health.router)
app.include_router(users.router)
app.include_router(patient.router)
app.include_router(study.router)
app.include_router(series.router)
app.include_router(image.router)
