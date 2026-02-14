from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.patient import Patient
from models.study import Study
from models.series import Series
from models.image import Image
from schemas.patient import PatientOut
from schemas.study import StudyOut
from schemas.series import SeriesOut
from schemas.image import ImageOut
from schemas.pagination import PaginatedResponse
from sqlalchemy import func, cast, String  

router = APIRouter(prefix="/patients", tags=["patients"])

from sqlalchemy import or_

#Global Patient List. -- batches of 10 (pagination) for performance
@router.get("/", response_model=PaginatedResponse[PatientOut])
def get_patients(
    db: Session = Depends(get_db),
    limit: int = Query(default=10, le=10, ge=1),
    offset: int = Query(default=0, ge=0),
    search: str = Query(None) # Added this
):
    # Start with a base query
    query = db.query(Patient)

    # If a search term is provided, apply the filter
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Patient.mrn.ilike(search_filter),
                Patient.last_name.ilike(search_filter),
                Patient.first_name.ilike(search_filter)
            )
        )

    # Get the count based on the filtered query
    total_count = query.count()
    
    # Apply pagination and sorting to the filtered query
    patients = query.order_by(Patient.last_name.asc()).offset(offset).limit(limit).all()
    
    return {
        "count": total_count,
        "results": patients
    }

#fliter patient records by ID (primary key)
@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

#get studies belonging to a ptient
@router.get("/{patient_id}/studies", response_model=List[StudyOut])
def get_patient_studies(patient_id: int, db: Session = Depends(get_db)):
    return db.query(Study).filter(Study.patient_id == patient_id).all()

@router.get("/{patient_id}/studies/{study_id}/series", response_model=List[SeriesOut])
def get_patient_series(patient_id: int, study_id: int, db: Session = Depends(get_db)):
    return db.query(Series).filter(Series.study_id == study_id).all()

#get sutudies, series, and images belongin to a particular patient
@router.get("/{patient_id}/studies/{study_id}/series/{series_id}/images", response_model=List[ImageOut])
def get_patient_images(patient_id: int, study_id: int, series_id: int, db: Session = Depends(get_db)):
    # PostgreSQL Concatenation: Last^First^Middle
    # Using coalesce to prevent NULL results if middle_name is empty
    patient_name = func.upper(
        func.rtrim(
            Patient.last_name + "^" + 
            Patient.first_name + "^" + 
            func.coalesce(Patient.middle_name, ""), 
            '^'
        )
    ).label("patient_name")
    results = db.query(
       Image.id,
        Image.series_id,
        Image.study_id,
        Image.image_uid,
        Image.instance_number,
        Image.image_position,
        Image.rows,
        Image.columns,
        Image.transfer_syntax_uid,
        Image.study_year,
        Image.modality,
        Image.image_url,
        patient_name,
        # Image.created_at,
        # Image.last_updated_at,         
        Patient.mrn.label("mrn"),    
        Study.accn_num.label("accn_num")
    ).join(Series, Image.series_id == Series.id) \
     .join(Study, Series.study_id == Study.id) \
     .join(Patient, Study.patient_id == Patient.id) \
     .filter(
         Image.series_id == series_id,
         Series.study_id == study_id,
         Study.patient_id == patient_id
     ).all()
    
    return results