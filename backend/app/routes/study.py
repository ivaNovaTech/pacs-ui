from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, or_, desc
from database import get_db
from models.study import Study
from models.patient import Patient
from typing import List, Optional, Any, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class StudyOut(BaseModel):
    id: int
    patient_id: int
    studyid: Optional[str] = None
    accn_num: Optional[str] = None
    study_uid: Optional[str] = None
    study_date: Optional[Any] = None
    study_year: Optional[int] = None
    modality: Optional[str] = None
    description: Optional[str] = None
    mrn: Optional[str] = None

    class Config:
        from_attributes = True

class PaginatedResponse(BaseModel, Generic[T]):
    count: int
    results: List[T]

# --- 2. ROUTER DEFINITION ---
router = APIRouter(prefix="/studies", tags=["studies"])

# --- 3. ROUTES ---

@router.get("/", response_model=PaginatedResponse[StudyOut])
def get_studies_all(
    db: Session = Depends(get_db),
    limit: int = Query(default=10, le=100, ge=1),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(None)
):
    """
    Paginated study list: /studies/?limit=10&offset=0
    """
    try:
        # Join Patient to get MRN
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
        
        # Newest first
        query = query.order_by(desc(Study.study_date))
        
        total_count = query.count()
        studies_raw = query.offset(offset).limit(limit).all()
        
        # Convert SQLAlchemy Rows to Dictionaries
        results = [dict(row._mapping) for row in studies_raw]
        
        return {
            "count": total_count,
            "results": results
        }
    except Exception as e:
        print(f"List Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
def get_study_stats(db: Session = Depends(get_db)):
    """
    Analytics returning modality dict and monthly dict in DESC order.
    """
    try:
        modalities_raw = db.query(Study.modality, func.count(Study.id))\
            .group_by(Study.modality).all()
        
        # Postgres DESC extraction
        monthly_raw = db.query(
            extract('year', Study.study_date).label('y'),
            extract('month', Study.study_date).label('m'),
            func.count(Study.id).label('total')
        ).group_by('y', 'm')\
         .order_by(desc('y'), desc('m'))\
         .all()

        monthly_stats_dict = {}
        for row in monthly_raw:
            if row.y and row.m:
                key = f"{int(row.y)}-{int(row.m):02d}"
                monthly_stats_dict[key] = row.total

        return {
            "modalities": {m: c for m, c in modalities_raw if m},
            "monthly": monthly_stats_dict,
            "total_studies": sum(c for m, c in modalities_raw)
        }
    except Exception as e:
        print(f"Stats Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))