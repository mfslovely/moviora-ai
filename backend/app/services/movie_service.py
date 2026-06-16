from app.schemas.movie import Movie


MOVIES = [
    {
        "id": "interstellar",
        "title": "Interstellar",
        "year": "2014",
        "rating": "8.7",
        "runtime": "2h 49m",
        "genres": ["Sci-Fi", "Drama", "Adventure"],
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
        "poster": "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/yIZ1xendyqKvY3FGeeUYUd5X9Mm.jpg",
        "overview": "A linguist tries to communicate with alien visitors after mysterious spacecraft arrive.",
        "audience_signal": "People love its quiet tone, language-first premise, and emotionally precise ending.",
        "sentiment": {"positive": 76, "neutral": 17, "negative": 7},
    },
]


class MovieService:
    def search(self, query: str) -> list[Movie]:
        normalized_query = query.strip().lower()
        if not normalized_query:
            return [Movie(**movie) for movie in MOVIES]

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
        return None


movie_service = MovieService()
