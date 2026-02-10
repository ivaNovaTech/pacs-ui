from datetime import datetime, date
from pydantic import BaseModel, ConfigDict
from typing import Optional

class PatientOut(BaseModel):
    id: int
    mrn: str
    last_name: str
    first_name: str
    middle_name: Optional[str] = None
    sex: str
    date_of_birth: date
    suffix: Optional[str] = None
    prefix: Optional[str] = None
    created_at: Optional[datetime] = None
    last_updated_at: Optional[datetime] = None
   
    model_config = ConfigDict(from_attributes=True)