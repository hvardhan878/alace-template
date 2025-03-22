from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
from pydantic import BaseModel
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create HTTP client
http_client = httpx.AsyncClient(base_url=f"http://localhost:{os.getenv('VITE_PORT', '8000')}")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Response model
class ConnectionStatus(BaseModel):
    connected: bool
    message: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Simple endpoint to check DB connection
@app.get("/api/status", response_model=ConnectionStatus)
def check_db_connection(db=Depends(get_db)):
    try:
        # Execute a simple query to check connection
        db.execute(text("SELECT 1"))
        return ConnectionStatus(connected=True, message="Database connected successfully")
    except Exception as e:
        return ConnectionStatus(connected=False, message=f"Database connection failed: {str(e)}")

# Proxy to Vite dev server
@app.api_route("/{path:path}", methods=["GET"])
async def proxy_to_vite(path: str, request: Request):
    # Don't proxy API routes
    if path.startswith("api/"):
        return {"error": "Not found"}
        
    url = f"/{path}" if path else "/"
    response = await http_client.get(url)
    return StreamingResponse(
        response.aiter_bytes(),
        status_code=response.status_code,
        headers=dict(response.headers)
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", "3000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
