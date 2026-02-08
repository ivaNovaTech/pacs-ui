from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional

class PatientCreate(BaseModel):
    mrn: str
    last_name: str
    first_name: str
    middle_name: str
    sex: str
    date_of_birth: datetime 
    suffix: str
    prefix: str

class PatientOut(BaseModel):
    id: int
    mrn: str
    last_name: str
    first_name: str
    middle_name: str
    sex: str
    date_of_birth: datetime 
    suffix: str
    prefix: str
    created_at: datetime
    last_updated_at: datetime
   
    model_config = {
        "from_attributes": True  # allows Pydantic to read SQLAlchemy attributes
    }

class PatientUpdate(BaseModel):
    mrn: Optional[str] = None
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    sex: Optional[str] = None
    date_of_birth: Optional[datetime] = None 
    suffix: Optional[str] = None
    prefix: Optional[str] = None

    model_config = {
        "from_attributes": True  # allows Pydantic to read SQLAlchemy attributes
    }