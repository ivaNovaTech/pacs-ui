from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional


class StudyCreate(BaseModel):
    study_id: int
    patient_id: int
    study_uid: str
    study_date: datetime
    study_year: int
    modality: str
    description: str


class StudyOut(BaseModel):
    id: int
    study_id: int
    patient_id: int
    study_uid: str
    study_date: datetime
    study_year: int
    modality: str
    description: str
    created_at: datetime
    last_updated_at: datetime
   
    model_config = {
        "from_attributes": True  # allows Pydantic to read SQLAlchemy attributes
    }

class StudyUpdate(BaseModel):
    study_id: Optional[int] = None
    patient_id: Optional[int] = None
    study_uid: Optional[str] = None
    study_date: Optional[datetime] = None
    study_year: Optional[int] = None
    modality: Optional[str] = None
    description: Optional[str] = None

    model_config = {
        "from_attributes": True  # allows Pydantic to read SQLAlchemy attributes
    }
