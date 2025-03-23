from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Response model for database connection status
class ConnectionStatus(BaseModel):
    connected: bool
    message: str

# Add more Pydantic models as needed for your application
"""
class UserBase(BaseModel):
    username: str
    email: str
    
class UserCreate(UserBase):
    password: str
    
class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        orm_mode = True
"""
