from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db import Base 

# 1. Import the Patient model instead of defining it here
# This prevents the "already defined" error
from .patient import Patient 

class Study(Base):
    __tablename__ = "study"
    
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, unique=True, nullable=False, index=True)
    
    # 2. Link to the patient table
    patient_id = Column(Integer, ForeignKey("patient.id"), nullable=False, index=True)
    
    study_uid = Column(String(255), unique=True, nullable=False, index=True)
    study_date = Column(DateTime(timezone=False), nullable=False)
    study_year = Column(Integer, nullable=False)
    modality = Column(String(100), nullable=False)
    description = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)    
    last_updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 3. Establish the relationship back to the Patient object
    patient = relationship("Patient", back_populates="studies")