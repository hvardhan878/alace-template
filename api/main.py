from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
from typing import List
from pydantic import BaseModel
import os
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create HTTP client
http_client = httpx.AsyncClient(base_url="http://localhost:3000")

# Proxy to Vite dev server
@app.api_route("/{path:path}", methods=["GET"])
async def proxy_to_vite(path: str, request: Request):
    # Don't proxy API routes
    if path.startswith("data"):
        return await get_data()
        
    url = f"/{path}" if path else "/"
    response = await http_client.get(url)
    return StreamingResponse(
        response.aiter_bytes(),
        status_code=response.status_code,
        headers=dict(response.headers)
    )

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class SalesData(Base):
    __tablename__ = "sales_data"
    
    id = Column(Integer, primary_key=True, index=True)
    month = Column(String)
    sales = Column(Float)
    revenue = Column(Float)

class DataPoint(BaseModel):
    month: str
    sales: float
    revenue: float

@app.get("/data", response_model=List[DataPoint])
async def get_data():
    return [
        DataPoint(month="Jan", sales=100, revenue=1500),
        DataPoint(month="Feb", sales=120, revenue=1800),
        DataPoint(month="Mar", sales=140, revenue=2100)
    ]

# Create sample data
@app.post("/init-db")
async def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(SalesData).first() is None:
            sample_data = [
                SalesData(month="Jan", sales=100, revenue=1500),
                SalesData(month="Feb", sales=120, revenue=1800),
                SalesData(month="Mar", sales=140, revenue=2100),
                SalesData(month="Apr", sales=160, revenue=2400),
                SalesData(month="May", sales=180, revenue=2700),
                SalesData(month="Jun", sales=200, revenue=3000),
            ]
            db.bulk_save_objects(sample_data)
            db.commit()
            return {"message": "Database initialized with sample data"}
        return {"message": "Database already contains data"}
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)