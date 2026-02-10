from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.patient import Patient
from app.models.study import Study
from app.models.series import Series
from app.models.image import Image
from app.schemas.patient import PatientOut
from app.schemas.study import StudyOut
from app.schemas.series import SeriesOut
from app.schemas.image import ImageOut

router = APIRouter(prefix="/patients", tags=["patients"])

# 1. List all patients
@router.get("/", response_model=List[PatientOut])
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

# 2. Get specific patient
@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

# 3. Get all studies for a patient (Matches your URL: /patients/10/studies)
@router.get("/{patient_id}/studies", response_model=List[StudyOut])
def get_patient_studies(patient_id: int, db: Session = Depends(get_db)):
    return db.query(Study).filter(Study.patient_id == patient_id).all()

# 4. Get all series for a specific study belonging to a patient
@router.get("/{patient_id}/studies/{study_id}/series", response_model=List[SeriesOut])
def get_patient_series(patient_id: int, study_id: int, db: Session = Depends(get_db)):
    return db.query(Series).filter(Series.study_id == study_id).all()

# 5. Get all images for a specific series
@router.get("/{patient_id}/studies/{study_id}/series/{series_id}/images", response_model=List[ImageOut])
def get_patient_images(patient_id: int, study_id: int, series_id: int, db: Session = Depends(get_db)):
    return db.query(Image).filter(Image.series_id == series_id).all()