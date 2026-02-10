from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SeriesBase(BaseModel):
    study_id: int
    series_uid: str
    series_number: Optional[int] = None
    modality: Optional[str] = None
    body_part_examined: Optional[str] = None
    description: Optional[str] = None
    study_year: Optional[int] = None

class SeriesOut(SeriesBase):
    id: int
    created_at: Optional[datetime] = None
    last_updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True