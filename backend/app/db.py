import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

# --- Auto-detect environment ---
if os.getenv("KUBERNETES_SERVICE_HOST"):
    # Inside GKE
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        os.getenv("DATABASE_URL_GKE")  # default GKE cluster service
    )
else:
    # Local development
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        os.getenv("DATABASE_URL_LOCAL")   # default local proxy
    )

print("Database configured successfully")

# --- SQLAlchemy engine & session ---
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
