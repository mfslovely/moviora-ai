from fastapi import APIRouter, HTTPException

from app.schemas.movie import Movie
from app.services.movie_service import movie_service

router = APIRouter()


@router.get("/search", response_model=list[Movie])
def search_movies(query: str = "") -> list[Movie]:
    return movie_service.search(query)


@router.get("/{movie_id}", response_model=Movie)
def get_movie(movie_id: str) -> Movie:
    movie = movie_service.get(movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie
