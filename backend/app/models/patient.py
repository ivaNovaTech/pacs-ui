from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db import Base



class Patient(Base):
    __tablename__ = "patient"
    
    id = Column(Integer, primary_key=True, index=True)
    mrn = Column(String(100), unique=True, nullable=False, index=True)
    last_name =  Column(String(100), nullable=False)
    first_name =  Column(String(100), nullable=False)
    middle_name =  Column(String(100))
    sex =  Column(String(100), nullable=False)
    date_of_birth = Column(DateTime(timezone=False), nullable=False)
    suffix = Column(String(100))
    prefix = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)    
    last_updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

