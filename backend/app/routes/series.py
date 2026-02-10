from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.series import Series
from app.schemas.series import SeriesOut

router = APIRouter(prefix="/series", tags=["series"])

@router.get("/", response_model=List[SeriesOut])
def get_all_series(db: Session = Depends(get_db)):
    return db.query(Series).all()

@router.get("/study/{study_id}", response_model=List[SeriesOut])
def get_series_by_study(study_id: int, db: Session = Depends(get_db)):
    series_list = db.query(Series).filter(Series.study_id == study_id).all()
    if not series_list:
        raise HTTPException(status_code=404, detail="No series found for this study")
    return series_list