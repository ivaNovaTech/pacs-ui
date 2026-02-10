from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.image import Image
from app.schemas.image import ImageOut

router = APIRouter(prefix="/images", tags=["images"])

@router.get("/", response_model=List[ImageOut])
def get_all_images(db: Session = Depends(get_db)):
    return db.query(Image).all()

@router.get("/series/{series_id}", response_model=List[ImageOut])
def get_images_by_series(series_id: int, db: Session = Depends(get_db)):
    # Returns an empty list [] if nothing found, making frontend handling easier
    return db.query(Image).filter(Image.series_id == series_id).all()