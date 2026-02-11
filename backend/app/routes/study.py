from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.study import Study
from app.schemas.study import StudyOut
from app.schemas.pagination import PaginatedResponse

router = APIRouter(prefix="/studies", tags=["studies"])

@router.get("/", response_model=PaginatedResponse[StudyOut])
def get_studies_all(
    db: Session = Depends(get_db),
    limit: int = Query(default=10, le=10, ge=1),
    offset: int = Query(default=0, ge=0)          
):
    studies = db.query(Study).offset(offset).limit(limit).all()
    total_count = db.query(Study).count()
    
    return {
        "count": total_count,
        "results": studies
    }

@router.get("/patient/{patient_id}", response_model=List[StudyOut])
def get_studies_by_patient(patient_id: int, db: Session = Depends(get_db)):
    studies = db.query(Study).filter(Study.patient_id == patient_id).all()
    if not studies:
        raise HTTPException(status_code=404, detail="No studies found for this patient")
    return studies