from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

# Try different import approaches
try:
    # When running as part of the package
    from api.db.database import get_db
    from api.models.schemas import ConnectionStatus
    from api.services.status_service import check_database_connection
except ModuleNotFoundError:
    try:
        # When imported from another file in the package
        from ..db.database import get_db
        from ..models.schemas import ConnectionStatus
        from ..services.status_service import check_database_connection
    except ImportError:
        # When running directly
        import sys
        import os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
        from api.db.database import get_db
        from api.models.schemas import ConnectionStatus
        from api.services.status_service import check_database_connection

router = APIRouter(tags=["status"])

@router.get("/status", response_model=ConnectionStatus)
def check_db_connection(db: Session = Depends(get_db)):
    return check_database_connection(db)
