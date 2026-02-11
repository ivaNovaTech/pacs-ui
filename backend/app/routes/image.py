from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.image import Image
from app.schemas.image import ImageOut

router = APIRouter(prefix="/images", tags=["images"])

@router.get("/", response_model=List[ImageOut])
def get_all_images(db: Session = Depends(get_db)):
    """Fetches all images. Use with caution given your 200k records!"""
    return db.query(Image).limit(100).all() 

@router.get("/series/{series_id}", response_model=List[ImageOut])
def get_images_by_series(series_id: int, db: Session = Depends(get_db)):
    """
    Fetches all image instances for a specific series.
    The 'image_url' is automatically included because it's in the model.
    """
    return db.query(Image).filter(Image.series_id == series_id).all()

@router.get("/{image_id}", response_model=ImageOut)
def get_single_image(image_id: int, db: Session = Depends(get_db)):
    """Helper route to get a single image's metadata and URL."""
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image