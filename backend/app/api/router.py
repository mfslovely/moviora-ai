from fastapi import APIRouter

from app.api.routes_ai import router as ai_router
from app.api.routes_db import router as db_router
from app.api.routes_movies import router as movies_router
from app.api.routes_rag import router as rag_router

api_router = APIRouter()
api_router.include_router(movies_router, prefix="/movies", tags=["movies"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
api_router.include_router(db_router, prefix="/db", tags=["database"])
api_router.include_router(rag_router, prefix="/rag", tags=["rag"])
