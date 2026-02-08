from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError 
from ..db import get_db
from ..models import User
from ..schemas import UserCreate, UserOut, UserUpdate
from ..auth import get_password_hash
from ..auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- POST: create a new user ---
@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=get_password_hash(user.password),
    )
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError as e:
        db.rollback()  # important: rollback the session!
        # Check if the error is a UNIQUE violation
        if "unique" in str(e.orig).lower():
            raise HTTPException(status_code=400, detail="Username or email already exists")
        # If some other integrity error, re-raise
        raise HTTPException(status_code=400, detail="Database integrity error")

    return UserOut.model_validate(new_user).model_dump()

# --- GET: list all users ---
@router.get("/", response_model=list[UserOut])
def list_users_all(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [UserOut.model_validate(u).model_dump() for u in users]
    

# --- GET: fetch one user ---
@router.get("/{id}", response_model=UserOut)
def list_users_1(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut.model_validate(user).model_dump()  # ✅ just .model_dump()


# --- PUT: update user by ID ---
@router.put("/{id}", response_model=UserOut)
def update_user(id: int, user_update: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields
    user.username = user_update.username
    user.first_name = user_update.first_name
    user.last_name = user_update.last_name
    user.email = user_update.email
    if user_update.password:  # hash only if password is provided
        user.password_hash = get_password_hash(user_update.password)

    try:
        db.commit()
        db.refresh(user)
        return UserOut.model_validate(user).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username or email already exists")


# --- PATCH: update User by ID (optional/select columns) ---
@router.patch("/{id}", response_model=UserOut)
def patch_user(id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for field, value in user_update.model_dump(exclude_unset=True).items():
        if field == "password":
            setattr(user, "password_hash", get_password_hash(value))
        else:
            setattr(user, field, value)

    try:
        db.commit()
        db.refresh(user)
        return UserOut.model_validate(user).model_dump()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Database constraint violated")


# --- DELETE: remove a user ---
@router.delete("/{id}", response_model=dict)
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": f"User {id} deleted successfully"}