from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from app.database import get_db
from app.models.study import Study
from app.models.patient import Patient
from app.schemas.study import StudyOut
from app.schemas.pagination import PaginatedResponse

router = APIRouter(prefix="/studies", tags=["studies"])

@router.get("/", response_model=PaginatedResponse[StudyOut])
def get_studies_all(
    db: Session = Depends(get_db),
    limit: int = Query(default=10, le=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(None)
):
    # 1. Join Patient to get MRN and filter by it
    query = db.query(
        Study.id,
        Study.patient_id,
        Study.studyid,
        Study.accn_num,
        Study.study_uid,
        Study.study_date,
        Study.study_year,
        Study.modality,
        Study.description,
        Patient.mrn
    ).join(Patient, Study.patient_id == Patient.id)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Study.modality.ilike(search_term),
                Study.description.ilike(search_term),
                Patient.mrn.ilike(search_term),
                Study.accn_num.ilike(search_term)
            )
        )
    
    # Order by date descending (newest first)
    query = query.order_by(Study.study_date.desc())
    
    total_count = query.count()
    studies_raw = query.offset(offset).limit(limit).all()
    
    # 3. Convert SQLAlchemy Row objects to dictionaries for Pydantic
    results = [dict(row._mapping) for row in studies_raw]
    
    return {
        "count": total_count,
        "results": results
    }