from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError 
from ..db import get_db
from ..models import Patient, User  
from ..schemas import PatientCreate, PatientOut, PatientUpdate
from ..auth import get_current_user

router = APIRouter(prefix="/patients", tags=["patients"])

# --- POST: create a new patient ---
@router.post("/", response_model=PatientOut)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

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
    except IntegrityError as e:
        db.rollback()  # important: rollback the session!
        # Check if the error is a UNIQUE violation
        if "unique" in str(e.orig).lower():
            raise HTTPException(status_code=400, detail="Patient (MRN) already exists")
        # If some other integrity error, re-raise
        raise HTTPException(status_code=400, detail="Database integrity error")

    return PatientOut.model_validate(new_patient).model_dump()


# --- GET: fetch one patient ---
@router.get("/{id}", response_model=PatientOut)
def list_patients_1(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return PatientOut.model_validate(patient).model_dump()  # ✅ just .model_dump()


# --- GET: list all patients - with pagination and offset ---
@router.get("/", response_model=list[PatientOut])
def list_patients_all(limit: int = 100, offset: int = 0, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patients = (
        db.query(Patient)
        .order_by(Patient.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [PatientOut.model_validate(u).model_dump() for u in patients]


# --- PUT: update Patient by ID ---
@router.put("/{id}", response_model=PatientOut)
def update_patient(id: int, patient_update: PatientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Update fields
    patient.mrn = patient_update.mrn
    patient.last_name = patient_update.last_name
    patient.first_name = patient_update.first_name
    patient.middle_name = patient_update.middle_name
    patient.sex = patient_update.sex
    patient.date_of_birth = patient_update.date_of_birth
    patient.suffix = patient_update.suffix
    patient.prefix = patient_update.prefix

    try:
        db.commit()
        db.refresh(patient)
        return PatientOut.model_validate(patient).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot update to that MRN. Already exists in the DB")

# --- PATCH: update Patient by ID (optional/select columns) ---
@router.patch("/{id}", response_model=PatientOut)
def patch_patient(id: int, patient_update: PatientUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Update only the fields that were provided
    for field, value in patient_update.model_dump(exclude_unset=True).items():
        setattr(patient, field, value)

    try:
        db.commit()
        db.refresh(patient)
        return PatientOut.model_validate(patient).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Database constraint violated")


# --- DELETE: remove a patient by ID ---
@router.delete("/{id}", response_model=dict)
def delete_patient_by_id(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"detail": f"Patient - ID {id} - deleted successfully"}

 # --- DELETE: remove a patient by MRN ---
@router.delete("/by-mrn/{mrn}", response_model=dict)
def delete_patient_by_mrn(mrn: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient = db.query(Patient).filter(Patient.mrn == mrn).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"detail": f"Patient - MRN {mrn} - deleted successfully"}