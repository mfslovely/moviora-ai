from fastapi import APIRouter

from app.rag.retriever import rag_service
from app.schemas.ai import ChatRequest, ChatResponse, RecommendationRequest, RecommendationResponse

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    return rag_service.answer(request)


@router.post("/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest) -> RecommendationResponse:
    return rag_service.recommend(request)
