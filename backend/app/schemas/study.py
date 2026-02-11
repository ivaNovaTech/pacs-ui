from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class StudyBase(BaseModel):
    patient_id: int
    studyid: str
    accn_num: str
    study_uid: str
    study_date: date
    study_year: Optional[int] = None
    modality: str
    description: str

class StudyOut(StudyBase):
    id: int
    mrn: Optional[str] = None
    created_at: Optional[datetime] = None
    last_updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True