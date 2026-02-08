from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError 
from ..db import get_db
from ..models import Image, User
from ..schemas import ImageCreate, ImageOut, ImageUpdate
from ..auth import get_current_user

router = APIRouter(prefix="/images", tags=["images"])

# --- POST: create a new image ---
@router.post("/", response_model=ImageOut)
def create_image(image: ImageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    
    new_image = Image(
        image_id=image.image_id,
        series_id=image.series_id,
        study_id=image.study_id,
        image_uid=image.image_uid,
        instance_number=image.instance_number,
        image_position=image.image_position,
        rows=image.rows,
        columns=image.columns,
        transfer_syntax_uid=image.transfer_syntax_uid,
        study_year=image.study_year,
        modality=image.modality
    )


    db.add(new_image)
    try:
        db.commit()
        db.refresh(new_image)
    except IntegrityError as e:
        db.rollback()  # important: rollback the session!
        # Check if the error is a UNIQUE violation
        if "unique" in str(e.orig).lower():
            raise HTTPException(status_code=400, detail="Image (UID/ID?) already exists")
        # If some other integrity error, re-raise
        raise HTTPException(status_code=400, detail="Database integrity error")

    return ImageOut.model_validate(new_image).model_dump()


# --- GET: fetch one image ---
@router.get("/{id}", response_model=ImageOut)
def list_images_1(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    image = db.query(Image).filter(Image.id == id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return ImageOut.model_validate(image).model_dump()  # ✅ just .model_dump()


# --- GET: list all images - with pagination and offset ---
@router.get("/", response_model=list[ImageOut])
def list_images_50_offest(limit: int = 100, offset: int = 0, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    images = (
        db.query(Image)
        .order_by(Image.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [ImageOut.model_validate(u).model_dump() for u in images]


# --- PUT: update Image by ID ---
@router.put("/{id}", response_model=ImageOut)
def update_image(id: int, image_update: ImageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    image = db.query(Image).filter(Image.id == id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Update fields
    image.series_id = image_update.series_id
    image.study_id = image_update.study_id
    image.image_uid = image_update.image_uid
    image.instance_number = image_update.instance_number
    image.image_position = image_update.image_position
    image.rows = image_update.rows
    image.columns = image_update.columns
    image.transfer_syntax_uid = image_update.transfer_syntax_uid
    image.study_year = image_update.study_year
    image.modality = image_update.modality

    try:
        db.commit()
        db.refresh(image)
        return ImageOut.model_validate(image).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot update. Image (UID/ID?) already exists in the DB")


# --- PATCH: update Image by ID (optional/select columns) ---
@router.patch("/{id}", response_model= ImageOut)
def patch_image(id: int, image_update: ImageUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    image = db.query(Image).filter(Image.id == id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Update only the fields that were provided
    for field, value in image_update.model_dump(exclude_unset=True).items():
        setattr(image, field, value)

    try:
        db.commit()
        db.refresh(image)
        return ImageOut.model_validate(image).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Database constraint violated")

# --- DELETE: remove an Image by ID ---
@router.delete("/{id}", response_model=dict)
def delete_image_by_id(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    image = db.query(Image).filter(Image.id == id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(image)
    db.commit()
    return {"detail": f"Image - ID {id} - deleted successfully"}

