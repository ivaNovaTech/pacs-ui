import os
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.db import get_db
from app.models import User
from app.auth import get_password_hash

load_dotenv()  # load .env

def main():
    new_password = os.getenv("ADMIN_NEW_PASSWORD")
    if not new_password:
        raise RuntimeError("ADMIN_NEW_PASSWORD not set in .env")

    db: Session = next(get_db())

    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        raise RuntimeError("Admin user not found")

    admin.password_hash = get_password_hash(new_password)

    db.commit()
    print("✅ Admin password updated successfully")

if __name__ == "__main__":
    main()
