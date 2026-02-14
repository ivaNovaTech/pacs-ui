from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey
from database import Base

class Series(Base):
    __tablename__ = "series"

    id = Column(Integer, primary_key=True, index=True)
    # series.study_id matches study.id
    study_id = Column(Integer, ForeignKey("study.id"))
    series_uid = Column(Text, nullable=False)
    series_number = Column(Integer)
    modality = Column(Text)
    body_part_examined = Column(Text)
    description = Column(Text)
    study_year = Column(Integer)
    created_at = Column(TIMESTAMP)
    last_updated_at = Column(TIMESTAMP)