from pydantic import BaseModel, Field


class SourceChunk(BaseModel):
    movie_id: str
    movie_title: str
    text: str
    score: float = Field(ge=0, le=1)


class ChatRequest(BaseModel):
    question: str
    movie_id: str | None = None
    top_k: int = Field(default=4, ge=1, le=10)


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]


class RecommendationRequest(BaseModel):
    preference: str
    top_k: int = Field(default=5, ge=1, le=10)


class Recommendation(BaseModel):
    title: str
    reason: str
    confidence: float = Field(ge=0, le=1)


class RecommendationResponse(BaseModel):
    recommendations: list[Recommendation]
