from sqlalchemy import Column, Integer, Text, Date, TIMESTAMP, String
from app.database import Base  # Updated here

class Patient(Base):
    __tablename__ = "patient"

    id = Column(Integer, primary_key=True, index=True)
    mrn = Column(Text, unique=True, nullable=False)
    last_name = Column(Text, nullable=False)
    first_name = Column(Text, nullable=False)
    middle_name = Column(Text)
    sex = Column(String(1), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    suffix = Column(Text)
    prefix = Column(Text)
    created_at = Column(TIMESTAMP)
    last_updated_at = Column(TIMESTAMP)