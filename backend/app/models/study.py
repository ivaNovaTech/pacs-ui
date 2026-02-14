from sqlalchemy import Column, Integer, Text, Date, TIMESTAMP, ForeignKey
from database import Base

class Study(Base):
    __tablename__ = "study"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient.id"))
    studyid = Column(Integer, unique=True)
    accn_num = Column(Text, nullable=False)
    study_uid = Column(Text, nullable=False)
    study_date = Column(Date, nullable=False)
    study_year = Column(Integer)
    modality = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP)
    last_updated_at = Column(TIMESTAMP)