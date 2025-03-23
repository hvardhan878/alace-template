from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Try different import approaches
try:
    # When running as a module from project root
    from api.routers import status, proxy
except ModuleNotFoundError:
    # When running directly
    import sys
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
    from api.routers import status, proxy

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

# Include routers
app.include_router(status.router, prefix="/api")
app.include_router(proxy.router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", "3000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)