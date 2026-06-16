from fastapi import APIRouter, HTTPException

from app.rag.vector_store import vector_store
from app.services.movie_service import movie_service
from app.schemas.ai import SourceChunk

router = APIRouter()


def movie_to_chunks(movie) -> list[str]:
    return [
        f"{movie.title} ({movie.year}) has rating {movie.rating} and runtime {movie.runtime}.",
        f"{movie.title} plot: {movie.overview}",
        f"{movie.title} genres: {', '.join(movie.genres)}.",
        f"{movie.title} cast: {', '.join(movie.cast) if movie.cast else 'Cast unavailable'}.",
        f"{movie.title} audience signal: {movie.audience_signal}",
    ]


@router.post("/ingest/movie/{movie_id}")
def ingest_movie(movie_id: str) -> dict[str, int | str]:
    movie = movie_service.get(movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    added = vector_store.upsert(
        movie_id=movie.id,
        movie_title=movie.title,
        texts=movie_to_chunks(movie),
        source="omdb",
    )
    return {"status": "ok", "movie_id": movie.id, "chunks_added": added}


@router.get("/search", response_model=list[SourceChunk])
def search_vector(query: str, movie_id: str | None = None, top_k: int = 5) -> list[SourceChunk]:
    return vector_store.search(query=query, movie_id=movie_id, top_k=top_k)
