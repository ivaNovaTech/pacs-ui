from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError 
from ..db import get_db
from ..models import Series, User
from ..schemas import SeriesCreate, SeriesOut, SeriesUpdate
from ..auth import get_current_user

router = APIRouter(prefix="/series", tags=["series"])

# --- POST: create a new series ---
@router.post("/", response_model=SeriesOut)
def create_series(series: SeriesCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    
    new_series = Series(
        series_id=series.series_id,
        study_id=series.study_id,
        series_uid=series.series_uid,
        series_number=series.series_number,
        modality=series.modality,
        body_part_examined=series.body_part_examined,
        description=series.description,
        study_year=series.study_year
    )


    db.add(new_series)
    try:
        db.commit()
        db.refresh(new_series)
    except IntegrityError as e:
        db.rollback()  # important: rollback the session!
        # Check if the error is a UNIQUE violation
        if "unique" in str(e.orig).lower():
            raise HTTPException(status_code=400, detail="Series (UID/ID?) already exists")
        # If some other integrity error, re-raise
        raise HTTPException(status_code=400, detail="Database integrity error")

    return SeriesOut.model_validate(new_series).model_dump()


# --- GET: fetch one series ---
@router.get("/{id}", response_model=SeriesOut)
def list_series_1(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    series = db.query(Series).filter(Series.id == id).first()
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")
    return SeriesOut.model_validate(series).model_dump()  # ✅ just .model_dump()


# --- GET: list all series  - with pagination and offset ---
@router.get("/", response_model=list[SeriesOut])
def list_series_50_offest(limit: int = 100, offset: int = 0, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    series = (
        db.query(Series)
        .order_by(Series.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [SeriesOut.model_validate(u).model_dump() for u in series]



# --- PUT: update Series by ID (all columns) ---
@router.put("/{id}", response_model=SeriesOut)
def update_series(id: int, series_update: SeriesCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    series = db.query(Series).filter(Series.id == id).first()
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")

    # Update fields
    series.study_id = series_update.study_id
    series.series_uid = series_update.series_uid
    series.series_number = series_update.series_number
    series.modality = series_update.modality
    series.body_part_examined = series_update.body_part_examined
    series.description = series_update.description
    series.study_year = series_update.study_year

    try:
        db.commit()
        db.refresh(series)
        return SeriesOut.model_validate(series).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot update. Series (UID/ID?) already exists in the DB")

# --- PATCH: update Series by ID (optional/select columns) ---
@router.patch("/{id}", response_model=SeriesOut)
def patch_series(id: int, series_update: SeriesUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    series = db.query(Series).filter(Series.id == id).first()
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")

    # Update only the fields that were provided
    for field, value in series_update.model_dump(exclude_unset=True).items():
        setattr(series, field, value)

    try:
        db.commit()
        db.refresh(series)
        return SeriesOut.model_validate(series).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Database constraint violated")


# --- DELETE: remove a Series by ID ---
@router.delete("/{id}", response_model=dict)
def delete_series_by_id(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    series = db.query(Series).filter(Series.id == id).first()
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")
    db.delete(series)
    db.commit()
    return {"detail": f"Series - ID {id} - deleted successfully"}
