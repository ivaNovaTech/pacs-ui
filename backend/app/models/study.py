from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db import Base


class Study(Base):
    __tablename__ = "study"
    
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, unique=True, nullable=False, index=True)
    patient_id = Column(Integer, nullable=False, index=True)
    study_uid = Column(String(255), unique=True, nullable=False, index=True)
    study_date = Column(DateTime(timezone=False), nullable=False)
    study_year = Column(Integer, nullable=False)
    modality = Column(String(100), nullable=False)
    description = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)    
    last_updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
