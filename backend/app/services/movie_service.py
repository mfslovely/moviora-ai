import httpx

from app.core.config import settings
from app.schemas.movie import Movie


MOVIES = [
    {
        "id": "interstellar",
        "title": "Interstellar",
        "year": "2014",
        "rating": "8.7",
        "runtime": "2h 49m",
        "genres": ["Sci-Fi", "Drama", "Adventure"],
        "cast": ["Matthew McConaughey as Cooper", "Anne Hathaway as Brand", "Jessica Chastain as Murph"],
        "poster": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
        "overview": "Explorers travel through a wormhole to find humanity a future home.",
        "audience_signal": "Viewers praise the emotional father-daughter core, practical spectacle, and ambitious science ideas.",
        "sentiment": {"positive": 72, "neutral": 18, "negative": 10},
    },
    {
        "id": "dune-part-two",
        "title": "Dune: Part Two",
        "year": "2024",
        "rating": "8.5",
        "runtime": "2h 47m",
        "genres": ["Sci-Fi", "Epic", "Action"],
        "cast": ["Timothee Chalamet as Paul Atreides", "Zendaya as Chani", "Rebecca Ferguson as Lady Jessica"],
        "poster": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
        "overview": "Paul Atreides joins the Fremen while confronting power, prophecy, and revenge.",
        "audience_signal": "Reviews highlight scale, sound design, political tension, and the darker evolution of Paul.",
        "sentiment": {"positive": 81, "neutral": 12, "negative": 7},
    },
    {
        "id": "arrival",
        "title": "Arrival",
        "year": "2016",
        "rating": "7.9",
        "runtime": "1h 56m",
        "genres": ["Sci-Fi", "Mystery", "Drama"],
        "cast": ["Amy Adams as Louise Banks", "Jeremy Renner as Ian Donnelly", "Forest Whitaker as Colonel Weber"],
        "poster": "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/yIZ1xendyqKvY3FGeeUYUd5X9Mm.jpg",
        "overview": "A linguist tries to communicate with alien visitors after mysterious spacecraft arrive.",
        "audience_signal": "People love its quiet tone, language-first premise, and emotionally precise ending.",
        "sentiment": {"positive": 76, "neutral": 17, "negative": 7},
    },
]

POSTER_FALLBACK = "https://placehold.co/500x750/151922/f7f2ea?text=No+Poster"


def split_csv(value: str | None) -> list[str]:
    if not value or value == "N/A":
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def safe_value(value: str | None, fallback: str = "N/A") -> str:
    if not value or value == "N/A":
        return fallback
    return value


def poster_value(value: str | None) -> str:
    if not value or value == "N/A":
        return POSTER_FALLBACK
    return value


class MovieService:
    def omdb_get(self, params: dict[str, str]) -> dict | None:
        if not settings.omdb_api_key:
            return None

        response = httpx.get(
            "https://www.omdbapi.com/",
            params={"apikey": settings.omdb_api_key, **params},
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()
        if data.get("Response") != "True":
            return None
        return data

    def from_omdb_search_item(self, item: dict) -> Movie:
        title = safe_value(item.get("Title"), "Untitled")
        year = safe_value(item.get("Year"), "Unknown")
        movie_type = safe_value(item.get("Type"), "movie").title()
        poster = poster_value(item.get("Poster"))
        return Movie(
            id=safe_value(item.get("imdbID"), title.lower().replace(" ", "-")),
            title=title,
            year=year,
            rating="Open",
            runtime=movie_type,
            genres=[movie_type],
            cast=[],
            poster=poster,
            backdrop=poster,
            overview="Open the movie page to fetch full OMDb details, ratings, cast, plot, and awards.",
            audience_signal="OMDb search result. Open details for AI-ready movie facts.",
            sentiment={"positive": 70, "neutral": 20, "negative": 10},
        )

    def from_omdb_detail(self, data: dict) -> Movie:
        poster = poster_value(data.get("Poster"))
        imdb_rating = safe_value(data.get("imdbRating"), "N/A")
        actors = split_csv(data.get("Actors"))
        return Movie(
            id=safe_value(data.get("imdbID"), safe_value(data.get("Title"), "movie").lower().replace(" ", "-")),
            title=safe_value(data.get("Title"), "Untitled"),
            year=safe_value(data.get("Year"), "Unknown"),
            rating=imdb_rating if imdb_rating != "N/A" else "Unrated",
            runtime=safe_value(data.get("Runtime"), "Runtime N/A"),
            genres=split_csv(data.get("Genre")) or [safe_value(data.get("Type"), "Movie").title()],
            cast=actors,
            poster=poster,
            backdrop=poster,
            overview=safe_value(data.get("Plot"), "No plot available from OMDb."),
            audience_signal=(
                f"OMDb facts: directed by {safe_value(data.get('Director'))}; "
                f"rated {safe_value(data.get('Rated'))}; awards: {safe_value(data.get('Awards'))}."
            ),
            sentiment={"positive": 70, "neutral": 20, "negative": 10},
        )

    def search(self, query: str) -> list[Movie]:
        normalized_query = query.strip().lower()
        if not normalized_query:
            return [Movie(**movie) for movie in MOVIES]

        omdb_data = self.omdb_get({"s": query.strip(), "type": "movie"})
        if omdb_data and omdb_data.get("Search"):
            return [self.from_omdb_search_item(item) for item in omdb_data["Search"][:12]]

        return [
            Movie(**movie)
            for movie in MOVIES
            if normalized_query in movie["title"].lower()
            or any(normalized_query in genre.lower() for genre in movie["genres"])
        ]

    def get(self, movie_id: str) -> Movie | None:
        for movie in MOVIES:
            if movie["id"] == movie_id:
                return Movie(**movie)

        if movie_id.startswith("tt"):
            omdb_data = self.omdb_get({"i": movie_id, "plot": "full"})
            if omdb_data:
                return self.from_omdb_detail(omdb_data)

        omdb_data = self.omdb_get({"t": movie_id.replace("-", " "), "plot": "full"})
        if omdb_data:
            return self.from_omdb_detail(omdb_data)

        return None


movie_service = MovieService()
