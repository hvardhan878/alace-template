from sqlalchemy.orm import Session
from sqlalchemy import text

# Try different import approaches based on how the file is run
try:
    # When running as part of the package
    from api.models.schemas import ConnectionStatus
except ModuleNotFoundError:
    try:
        # When imported from another file in the package
        from ..models.schemas import ConnectionStatus
    except ImportError:
        # When running directly
        import sys
        import os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
        from api.models.schemas import ConnectionStatus

def check_database_connection(db: Session) -> ConnectionStatus:
    """Check if database connection is working"""
    try:
        # Execute a simple query to check connection
        db.execute(text("SELECT 1"))
        return ConnectionStatus(connected=True, message="Database connected successfully")
    except Exception as e:
        return ConnectionStatus(connected=False, message=f"Database connection failed: {str(e)}")
