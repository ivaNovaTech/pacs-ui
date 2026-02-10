from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.study import Study
from app.schemas.study import StudyOut

router = APIRouter(prefix="/studies", tags=["studies"])

@router.get("/", response_model=List[StudyOut])
def get_studies_all(
    db: Session = Depends(get_db),
    limit: int = Query(default=100, le=100, ge=1),
    offset: int = Query(default=0, ge=0)          
):
    return db.query(Study).offset(offset).limit(limit).all()


#2. List all studies for a given patient
@router.get("/patient/{patient_id}", response_model=List[StudyOut])
def get_studies_by_patient(patient_id: int, db: Session = Depends(get_db)):
    studies = db.query(Study).filter(Study.patient_id == patient_id).all()
    if not studies:
        raise HTTPException(status_code=404, detail="No studies found for this patient")
    return studies