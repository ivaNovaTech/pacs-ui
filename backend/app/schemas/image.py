from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional


class ImageCreate(BaseModel):
    series_id: int
    study_id: int
    image_uid: str
    instance_number: int
    image_position: int
    rows: int
    columns: int
    transfer_syntax_uid: str
    study_year: int
    modality: str
    

class ImageOut(BaseModel):
    id: int
    series_id: int
    study_id: int
    image_uid: str
    instance_number: int
    image_position: int
    rows: int
    columns: int
    transfer_syntax_uid: str
    study_year: int
    modality: str
    created_at: datetime
    last_updated_at: datetime

    model_config = {
        "from_attributes": True  # allows Pydantic to read SQLAlchemy attributes
    }

class ImageUpdate(BaseModel):
    series_id: Optional[int] = None
    study_id: Optional[int] = None
    image_uid: Optional[str] = None
    instance_number: Optional[int] = None
    image_position: Optional[int] = None
    rows: Optional[int] = None
    columns: Optional[int] = None
    transfer_syntax_uid: Optional[str] = None
    study_year: Optional[int] = None
    modality: Optional[str]  = None

    model_config = {
        "from_attributes": True  # allows Pydantic to read SQLAlchemy attributes
    }

