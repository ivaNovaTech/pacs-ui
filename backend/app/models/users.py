from sqlalchemy import Column, Integer, String, Boolean, DateTime, TIMESTAMP
from sqlalchemy.sql import func
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    first_name =  Column(String(100), nullable=False)
    last_name =  Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
    last_updated_at = Column(TIMESTAMP(timezone=True), nullable=False)