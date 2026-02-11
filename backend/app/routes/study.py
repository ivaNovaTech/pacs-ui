from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
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
    search: str = Query(None)
):
    # 1. Explicitly list the columns so they match the StudyOut schema exactly
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
                Patient.mrn.ilike(search_term)
            )
        )
    
    total_count = query.count()
    
    # 2. Fetch the results
    studies_raw = query.offset(offset).limit(limit).all()
    
    # 3. Convert SQLAlchemy Row objects to dictionaries 
    # This allows Pydantic to map the fields correctly
    results = [dict(row._mapping) for row in studies_raw]
    
    return {
        "count": total_count,
        "results": results
    }