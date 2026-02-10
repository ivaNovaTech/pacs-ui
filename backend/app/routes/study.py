from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.study import Study
from app.schemas.study import StudyOut

router = APIRouter(prefix="/studies", tags=["studies"])

@router.get("/", response_model=List[StudyOut])
def get_all_studies(db: Session = Depends(get_db)):
    return db.query(Study).all()

@router.get("/patient/{patient_id}", response_model=List[StudyOut])
def get_studies_by_patient(patient_id: int, db: Session = Depends(get_db)):
    studies = db.query(Study).filter(Study.patient_id == patient_id).all()
    if not studies:
        raise HTTPException(status_code=404, detail="No studies found for this patient")
    return studies