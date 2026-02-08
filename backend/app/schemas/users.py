from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    created_at: datetime

    model_config = {
        "from_attributes": True  # allows Pydantic to read SQLAlchemy attributes
    }

class UserUpdate(BaseModel):
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]
