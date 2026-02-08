from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional


class SeriesCreate(BaseModel):
    study_id: int
    series_uid: str
    series_number: int
    modality: str
    body_part_examined: str
    description: str
    study_year: int


class SeriesOut(BaseModel):
    id: int
    study_id: int
    series_uid: str
    series_number: int
    modality: str
    body_part_examined: str
    description: str
    study_year: int
    created_at: datetime
    last_updated_at: datetime

    model_config = {
        "from_attributes": True  # allows Pydantic to read SQLAlchemy attributes
    }


class SeriesUpdate(BaseModel):
    study_id: Optional[int] = None
    series_uid: Optional[str] = None
    series_number: Optional[int] = None
    modality: Optional[str] = None
    body_part_examined: Optional[str] = None
    description: Optional[str] = None
    study_year: Optional[int] = None

    model_config = {
        "from_attributes": True  # allows Pydantic to read SQLAlchemy attributes
    }

