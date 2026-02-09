from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from ..db import get_db
from ..models import Patient
from ..schemas import PatientCreate, PatientOut, PatientUpdate

router = APIRouter(prefix="/patients", tags=["patients"])

# --- POST: create a new patient ---
@router.post("/", response_model=PatientOut)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(
        mrn=patient.mrn,
        last_name=patient.last_name,
        first_name=patient.first_name,
        middle_name=patient.middle_name,
        sex=patient.sex,
        date_of_birth=patient.date_of_birth,
        suffix=patient.suffix,
        prefix=patient.prefix
    )
    db.add(new_patient)
    try:
        db.commit()
        db.refresh(new_patient)
        return new_patient
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error: MRN might already exist.")

# --- GET: fetch one patient by ID ---
@router.get("/{id}", response_model=PatientOut)
def get_patient(id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

# --- GET: list all patients (with pagination) ---
@router.get("/", response_model=List[PatientOut])
def list_patients(limit: int = 100, offset: int = 0, db: Session = Depends(get_db)):
    patients = (
        db.query(Patient)
        .order_by(Patient.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return patients

# --- PATCH: update patient ---
@router.patch("/{id}", response_model=PatientOut)
def patch_patient(id: int, patient_update: PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Only update the fields that were actually sent in the request
    update_data = patient_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    try:
        db.commit()
        db.refresh(patient)
        return patient
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Update failed due to database constraint.")

# --- DELETE: remove patient ---
@router.delete("/{id}", response_model=dict)
def delete_patient(id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(patient)
    db.commit()
    return {"detail": f"Patient with ID {id} deleted successfully"}