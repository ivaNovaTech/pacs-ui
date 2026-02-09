from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from ..db import Base 


class Series(Base):
    __tablename__ = "series"
    
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, nullable=False, index=True)
    series_uid = Column(String(255), unique=True, nullable=False, index=True)
    series_number = Column(Integer, nullable=False)
    modality = Column(String(100), nullable=False)
    body_part_examined = Column(String(255))
    description = Column(String(255))
    study_year = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)    
    last_updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
