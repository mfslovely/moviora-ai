from pydantic import BaseModel


class Sentiment(BaseModel):
    positive: int
    neutral: int
    negative: int


class Movie(BaseModel):
    id: str
    title: str
    year: str
    rating: str
    runtime: str
    genres: list[str]
    poster: str
    backdrop: str
    overview: str
    audience_signal: str
    sentiment: Sentiment
