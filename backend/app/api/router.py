from fastapi import APIRouter

from app.api.routes_ai import router as ai_router
from app.api.routes_movies import router as movies_router

api_router = APIRouter()
api_router.include_router(movies_router, prefix="/movies", tags=["movies"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
