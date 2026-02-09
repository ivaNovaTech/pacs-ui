from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Study
from ..schemas import StudyOut

router = APIRouter(prefix="/studies", tags=["studies"])

# --- GET: fetch all studies for a specific patient ---
@router.get("/by-patient/{patient_id}", response_model=list[StudyOut])
def list_studies_by_patient(
    patient_id: int, 
    db: Session = Depends(get_db)
    # The current_user dependency was removed from here
):
    try:
        studies = db.query(Study).filter(Study.patient_id == patient_id).all()
        # We return an empty list if no studies found so Angular doesn't crash
        return [StudyOut.model_validate(s).model_dump() for s in studies]
    except Exception as e:
        print(f"Error fetching studies: {e}")
        raise HTTPException(status_code=500, detail="Database error")