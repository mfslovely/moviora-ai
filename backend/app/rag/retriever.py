from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    Recommendation,
    RecommendationRequest,
    RecommendationResponse,
    SourceChunk,
)


KNOWLEDGE_CHUNKS = [
    SourceChunk(
        movie_id="interstellar",
        movie_title="Interstellar",
        text="Interstellar is frequently discussed as emotional science fiction because its central conflict is a parent-child bond stretched across time, survival, and sacrifice.",
        score=0.92,
    ),
    SourceChunk(
        movie_id="arrival",
        movie_title="Arrival",
        text="Arrival combines alien contact with grief, language, memory, and acceptance, making its science-fiction premise feel intimate rather than purely technical.",
        score=0.89,
    ),
    SourceChunk(
        movie_id="dune-part-two",
        movie_title="Dune: Part Two",
        text="Dune: Part Two receives praise for scale, sound, desert imagery, and political tragedy, while some viewers find the tone intentionally cold and severe.",
        score=0.86,
    ),
    SourceChunk(
        movie_id="interstellar",
        movie_title="Interstellar",
        text="Audience reviews often mention Hans Zimmer's score, practical spectacle, black hole visuals, and the final emotional reunion as major strengths.",
        score=0.84,
    ),
]


class RagService:
    def retrieve(self, question: str, movie_id: str | None, top_k: int) -> list[SourceChunk]:
        query_terms = set(question.lower().split())
        candidates = [
            chunk for chunk in KNOWLEDGE_CHUNKS if movie_id is None or chunk.movie_id == movie_id
        ]

        scored_chunks: list[SourceChunk] = []
        for chunk in candidates:
            chunk_terms = set(chunk.text.lower().split())
            overlap = len(query_terms.intersection(chunk_terms))
            score = min(1.0, chunk.score + overlap * 0.01)
            scored_chunks.append(chunk.model_copy(update={"score": score}))

        return sorted(scored_chunks, key=lambda chunk: chunk.score, reverse=True)[:top_k]

    def answer(self, request: ChatRequest) -> ChatResponse:
        sources = self.retrieve(request.question, request.movie_id, request.top_k)
        context = " ".join(source.text for source in sources[:2])
        answer = (
            f"Based on the retrieved movie knowledge, {context} "
            "A production LLM step would turn these chunks into a polished answer with citations."
        )
        return ChatResponse(answer=answer, sources=sources)

    def recommend(self, request: RecommendationRequest) -> RecommendationResponse:
        preference = request.preference.lower()
        recommendations = [
            Recommendation(
                title="Interstellar",
                reason="Strong fit for emotional science fiction, sacrifice, time, and family stakes.",
                confidence=0.93 if "time" in preference or "emotional" in preference else 0.81,
            ),
            Recommendation(
                title="Arrival",
                reason="Best fit for quiet, intelligent sci-fi with grief, communication, and memory.",
                confidence=0.9 if "emotional" in preference or "story" in preference else 0.78,
            ),
            Recommendation(
                title="Dune: Part Two",
                reason="Recommended for epic scale, political tension, world-building, and intense atmosphere.",
                confidence=0.82,
            ),
        ]
        return RecommendationResponse(recommendations=recommendations[: request.top_k])


rag_service = RagService()
