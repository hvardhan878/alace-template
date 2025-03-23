from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

# Create HTTP client
http_client = httpx.AsyncClient(base_url=f"http://localhost:{os.getenv('VITE_PORT', '8000')}")

router = APIRouter()

# Proxy to Vite dev server
@router.api_route("/{path:path}", methods=["GET"])
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
