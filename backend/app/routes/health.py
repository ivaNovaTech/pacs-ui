from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
import psutil
import shutil

router = APIRouter()

@router.get("/system-health")
def get_system_health(db: Session = Depends(get_db)):
    
    # 1. Check Database Heartbeat (The Select 1 check)
    db_online = False
    try:
        db.execute(text("SELECT 1"))
        db_online = True
    except Exception:
        db_online = False

    # 2. Collect System Metrics
    cpu = psutil.cpu_percent(interval=None)
    ram = psutil.virtual_memory()
    disk = shutil.disk_usage("/")

    return {
        "status": "online" if db_online else "degraded",
        "db_status": "online" if db_online else "offline",
        "cpu_usage": cpu,
        "ram_usage": ram.percent,
        "ram_raw": f"{round(ram.used / (1024*1024))} / {round(ram.total / (1024*1024))} MB",
        "disk_usage": round((disk.used / disk.total) * 100, 1),
        "disk_used": round(disk.used / (1024**3)),
        "disk_total": round(disk.total / (1024**3)),
        "hdd_raw": f"{round(disk.used / (1024**3))} / {round(disk.total / (1024**3))} GB"
    }