from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db import Base


class Image(Base):
    __tablename__ = "image"
    
    id = Column(Integer, primary_key=True, index=True) 
    series_id = Column(Integer, nullable=False, index=True)
    study_id = Column(Integer, nullable=False, index=True)
    image_uid = Column(String(255), unique=True, nullable=False, index=True)
    instance_number = Column(Integer, nullable=False)
    image_position = Column(Integer)
    rows = Column(Integer, nullable=False)
    columns = Column(Integer, nullable=False)
    transfer_syntax_uid = Column(String(255), nullable=False)
    study_year = Column(Integer, nullable=False)
    modality = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)    
    last_updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

