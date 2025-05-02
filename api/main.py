from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from fastapi.responses import HTMLResponse
from datetime import datetime

# Load environment variables
load_dotenv()

# Server startup timestamp for tracking changes
SERVER_START_TIME = datetime.now().isoformat()

app = FastAPI(title="Simple FastAPI App", 
             description="A clean FastAPI application",
             version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/version")
def get_version():
    """Return the current API version (timestamp when server started)"""
    return {"version": SERVER_START_TIME}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/hello")
def say_hello():
    return "Hello, World!"


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", "3000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
