from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
from typing import List, Optional
from pydantic import BaseModel
import os
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
http_client = httpx.AsyncClient(base_url=f"http://localhost:{os.getenv('VITE_PORT', '8000')}")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)

# Pydantic models
class ItemBase(BaseModel):
    title: str
    description: str

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    
    class Config:
        from_attributes = True  # Updated from orm_mode=True which is deprecated

# Create tables at startup
@app.on_event("startup")
async def startup_db_client():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

# CRUD endpoints
@app.get("/api/items", response_model=List[ItemResponse])
def get_items(skip: int = 0, limit: int = 100, db = Depends(get_db)):
    items = db.query(Item).offset(skip).limit(limit).all()
    return items

@app.post("/api/items", response_model=ItemResponse, status_code=201)
def create_item(item: ItemCreate, db = Depends(get_db)):
    db_item = Item(**item.model_dump())  # Updated from dict() to model_dump()
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/api/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.put("/api/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item: ItemCreate, db = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
        
    for key, value in item.model_dump().items():  # Updated from dict() to model_dump()
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/items/{item_id}")
def delete_item(item_id: int, db = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(db_item)
    db.commit()
    return {"detail": "Item deleted"}

# Initialize database with sample data
@app.post("/api/init-db")
def init_db():
    # Tables should already be created at startup, but create them again just in case
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(Item).first() is None:
            sample_items = [
                Item(title="First Item", description="This is the first item"),
                Item(title="Second Item", description="This is the second item"),
                Item(title="Third Item", description="This is the third item"),
            ]
            db.bulk_save_objects(sample_items)
            db.commit()
            return {"message": "Database initialized with sample data"}
        return {"message": "Database already contains data"}
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", "3000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)