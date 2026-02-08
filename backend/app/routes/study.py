from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError 
from ..db import get_db
from ..models import Study, User
from ..schemas import StudyCreate, StudyOut, StudyUpdate
from ..auth import get_current_user

router = APIRouter(prefix="/studies", tags=["studies"])

# --- POST: create a new study ---
@router.post("/", response_model=StudyOut)
def create_study(study: StudyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    new_study = Study(
        study_id=study.study_id,
        patient_id=study.patient_id,
        study_uid=study.study_uid,
        study_date=study.study_date,
        study_year=study.study_year,
        modality=study.modality,
        description=study.description
    )

    db.add(new_study)
    try:
        db.commit()
        db.refresh(new_study)
    except IntegrityError as e:
        db.rollback()  # important: rollback the session!
        # Check if the error is a UNIQUE violation
        if "unique" in str(e.orig).lower():
            raise HTTPException(status_code=400, detail="Study (UID/ID?) already exists")
        # If some other integrity error, re-raise
        raise HTTPException(status_code=400, detail="Database integrity error")

    return StudyOut.model_validate(new_study).model_dump()


# --- GET: fetch one study ---
@router.get("/{id}", response_model=StudyOut)
def list_studies_1(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    study = db.query(Study).filter(Study.id == id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return StudyOut.model_validate(study).model_dump()  # ✅ just .model_dump()



# --- GET: list all studies - with pagination and offset ---
@router.get("/", response_model=list[StudyOut])
def list_studies_50_offest(limit: int = 100, offset: int = 0, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    studies = (
        db.query(Study)
        .order_by(Study.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [StudyOut.model_validate(u).model_dump() for u in studies]



# --- PUT: update Study by ID ---
@router.put("/{id}", response_model=StudyOut)
def update_study(id: int, study_update: StudyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    study = db.query(Study).filter(Study.id == id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    # Update fields
    study.study_id = study_update.study_id
    study.patient_id = study_update.patient_id
    study.study_uid = study_update.study_uid
    study.study_date = study_update.study_date
    study.study_year = study_update.study_year
    study.modality = study_update.modality
    study.description = study_update.description

    try:
        db.commit()
        db.refresh(study)
        return StudyOut.model_validate(study).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot update. Study already exists in the DB")

# --- PATCH: update Study by ID (optional/select columns) ---
@router.patch("/{id}", response_model=StudyOut)
def patch_study(id: int, study_update: StudyUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    study = db.query(Study).filter(Study.id == id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    # Update only the fields that were provided
    for field, value in study_update.model_dump(exclude_unset=True).items():
        setattr(study, field, value)

    try:
        db.commit()
        db.refresh(study)
        return StudyOut.model_validate(study).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Database constraint violated")


# --- DELETE: remove a Study by ID ---
@router.delete("/{id}", response_model=dict)
def delete_study_by_id(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    study = db.query(Study).filter(Study.id == id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    db.delete(study)
    db.commit()
    return {"detail": f"Study - ID {id} - deleted successfully"}

 # --- DELETE: remove a study by Study ID ---
@router.delete("/by-study-id/{study_id}", response_model=dict)
def delete_study_by_study_id(study_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    study = db.query(Study).filter(Study.study_id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    db.delete(study)
    db.commit()
    return {"detail": f"Study - Study ID {study_id} - deleted successfully"}