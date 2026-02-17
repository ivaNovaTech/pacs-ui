from sqlalchemy import Column, Integer, Text, ForeignKey, TIMESTAMP
from database import Base # Fixed: was pointing to ..db


class Image(Base):
    __tablename__ = "image"

    id = Column(Integer, primary_key=True, index=True)
    series_id = Column(Integer, ForeignKey("series.id"))
    study_id = Column(Integer) 
    image_uid = Column(Text, nullable=False)
    instance_number = Column(Integer)
    image_position = Column(Text)
    rows = Column(Integer)
    columns = Column(Integer)
    transfer_syntax_uid = Column(Text, nullable=False)
    study_year = Column(Integer)
    modality = Column(Text)
    image_url = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
    last_updated_at = Column(TIMESTAMP(timezone=True), nullable=False)