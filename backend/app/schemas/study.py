from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class StudyBase(BaseModel):
    study_id: Optional[int] = None
    patient_id: int
    study_uid: str
    study_date: date
    study_year: Optional[int] = None
    modality: str
    description: str

class StudyOut(StudyBase):
    id: int
    created_at: Optional[datetime] = None
    last_updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True