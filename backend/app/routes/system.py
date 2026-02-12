import psutil
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/system-health", tags=["system"])

@router.get("/")
def get_health():
    """
    Returns actual system metrics including raw MB/GB values.
    """
    try:
        # Memory metrics
        mem = psutil.virtual_memory()
        ram_used_mb = int(mem.used / (1024 * 1024))
        ram_total_mb = int(mem.total / (1024 * 1024))
        
        # Disk metrics
        disk = psutil.disk_usage('/')
        disk_used_gb = int(disk.used / (1024 * 1024 * 1024))
        disk_total_gb = int(disk.total / (1024 * 1024 * 1024))

        return {
            "status": "online",
            "cpu_usage": psutil.cpu_percent(interval=None),
            "ram_usage": mem.percent,
            "ram_used": ram_used_mb,
            "ram_total": ram_total_mb,
            "disk_usage": disk.percent,
            "disk_used": disk_used_gb,
            "disk_total": disk_total_gb
        }
    except Exception as e:
        return {
            "status": "error",
            "detail": str(e)
        }