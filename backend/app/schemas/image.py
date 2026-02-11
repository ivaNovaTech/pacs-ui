from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ImageBase(BaseModel):
    series_id: int
    study_id: Optional[int] = None
    image_uid: str
    instance_number: Optional[int] = None
    image_position: Optional[int] = None
    rows: Optional[int] = None
    columns: Optional[int] = None
    transfer_syntax_uid: str
    study_year: Optional[int] = None
    modality: Optional[str] = None
    image_url: Optional[str] = None

class ImageOut(ImageBase):
    id: int
    created_at: Optional[datetime] = None
    last_updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True