import re
from functools import lru_cache

import httpx
from openai import OpenAI

from app.core.config import settings
from app.rag.vector_store import vector_store
from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    Recommendation,
    RecommendationRequest,
    RecommendationResponse,
    SourceChunk,
)

MOVIE_TITLES_BY_ID = {
    "interstellar": "Interstellar",
    "arrival": "Arrival",
    "dune-part-two": "Dune: Part Two",
    "kabhi-khushi-kabhie-gham": "Kabhi Khushi Kabhie Gham",
}

KNOWLEDGE_CHUNKS = [
    SourceChunk(movie_id="interstellar", movie_title="Interstellar", text="Interstellar is emotional science fiction about Cooper, a former pilot who travels through a wormhole to help save humanity while being separated from his daughter Murph.", score=0.92),
    SourceChunk(movie_id="interstellar", movie_title="Interstellar", text="Interstellar stars Matthew McConaughey as Cooper, Anne Hathaway as Brand, and Jessica Chastain as Murph. The main lead character is Cooper.", score=0.9),
    SourceChunk(movie_id="interstellar", movie_title="Interstellar", text="Interstellar filming locations included Alberta in Canada, Iceland, and Los Angeles-area studio work in the United States.", score=0.88),
    SourceChunk(movie_id="arrival", movie_title="Arrival", text="Arrival follows linguist Louise Banks as she learns to communicate with alien visitors and discovers that language changes how she understands time, grief, and choice.", score=0.92),
    SourceChunk(movie_id="arrival", movie_title="Arrival", text="Arrival stars Amy Adams as Louise Banks, Jeremy Renner as Ian Donnelly, and Forest Whitaker as Colonel Weber. The central lead character is Louise Banks.", score=0.91),
    SourceChunk(movie_id="arrival", movie_title="Arrival", text="Arrival was filmed mainly in Quebec, Canada, including Montreal and surrounding locations. Its production used Canadian locations for the military and academic settings.", score=0.9),
    SourceChunk(movie_id="dune-part-two", movie_title="Dune: Part Two", text="Dune: Part Two stars Timothee Chalamet as Paul Atreides, Zendaya as Chani, and Rebecca Ferguson as Lady Jessica. The central lead character is Paul Atreides.", score=0.9),
    SourceChunk(movie_id="dune-part-two", movie_title="Dune: Part Two", text="Dune: Part Two was filmed across desert and studio locations including Jordan, Abu Dhabi, Hungary, and Italy.", score=0.89),
    SourceChunk(movie_id="dune-part-two", movie_title="Dune: Part Two", text="Dune: Part Two receives praise for scale, sound, desert imagery, and political tragedy, while some viewers find the tone intentionally cold and severe.", score=0.86),
    SourceChunk(movie_id="kabhi-khushi-kabhie-gham", movie_title="Kabhi Khushi Kabhie Gham", text="Kabhi Khushi Kabhie Gham stars Shah Rukh Khan as Rahul, Kajol as Anjali, Amitabh Bachchan as Yash, Hrithik Roshan as Rohan, and Kareena Kapoor as Poo.", score=0.9),
    SourceChunk(movie_id="kabhi-khushi-kabhie-gham", movie_title="Kabhi Khushi Kabhie Gham", text="Kabhi Khushi Kabhie Gham is a family drama about love, pride, class expectations, separation, and reunion inside a wealthy Indian family.", score=0.87),
    SourceChunk(movie_id="kabhi-khushi-kabhie-gham", movie_title="Kabhi Khushi Kabhie Gham", text="Kabhi Khushi Kabhie Gham was filmed in India and the United Kingdom, with many memorable scenes set around London and lavish family interiors.", score=0.86),
]


def normalize_text(value: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", " ", value.lower())


@lru_cache(maxsize=128)
def fetch_omdb(params_key: tuple[tuple[str, str], ...]) -> dict[str, str] | None:
    if not settings.omdb_api_key:
        return None

    try:
        response = httpx.get(
            "https://www.omdbapi.com/",
            params={"apikey": settings.omdb_api_key, **dict(params_key), "plot": "full"},
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()
    except Exception:
        return None

    if data.get("Response") != "True":
        return None

    return data


def fetch_omdb_by_title(title: str) -> dict[str, str] | None:
    return fetch_omdb(tuple(sorted({"t": title}.items())))


def fetch_omdb_by_id(imdb_id: str) -> dict[str, str] | None:
    return fetch_omdb(tuple(sorted({"i": imdb_id}.items())))


class RagService:
    def infer_movie(self, question: str, movie_id: str | None) -> tuple[str | None, str | None, dict[str, str] | None]:
        if movie_id and movie_id.startswith("tt"):
            omdb_data = fetch_omdb_by_id(movie_id)
            if omdb_data:
                return movie_id, omdb_data.get("Title"), omdb_data

        if movie_id and movie_id in MOVIE_TITLES_BY_ID:
            title = MOVIE_TITLES_BY_ID[movie_id]
            return movie_id, title, fetch_omdb_by_title(title)

        normalized_question = normalize_text(question)
        for candidate_id, title in MOVIE_TITLES_BY_ID.items():
            if normalize_text(title) in normalized_question:
                return candidate_id, title, fetch_omdb_by_title(title)

        return movie_id, None, None

    def build_omdb_chunks(self, movie_id: str | None, movie_title: str | None, data: dict[str, str] | None) -> list[SourceChunk]:
        if not movie_title or not data:
            return []

        rating_parts = []
        if data.get("imdbRating") and data["imdbRating"] != "N/A":
            rating_parts.append(f"IMDb rating is {data['imdbRating']}/10")
        if data.get("Metascore") and data["Metascore"] != "N/A":
            rating_parts.append(f"Metascore is {data['Metascore']}/100")
        for rating in data.get("Ratings", []):
            source = rating.get("Source")
            value = rating.get("Value")
            if source and value:
                rating_parts.append(f"{source} rating is {value}")

        facts = [
            f"OMDb title is {data.get('Title')} ({data.get('Year')}).",
            f"Plot: {data.get('Plot')}",
            f"Actors: {data.get('Actors')}",
            f"Director: {data.get('Director')}",
            f"Genre: {data.get('Genre')}",
            f"Released: {data.get('Released')}",
            f"Runtime: {data.get('Runtime')}",
            f"Awards: {data.get('Awards')}",
            f"Ratings: {'; '.join(rating_parts) if rating_parts else 'No ratings returned by OMDb.'}",
        ]
        text = " ".join(part for part in facts if part and "N/A" not in part)

        return [
            SourceChunk(
                movie_id=movie_id or normalize_text(movie_title).replace(" ", "-"),
                movie_title=movie_title,
                text=text,
                score=0.98,
            )
        ]

    def retrieve(self, question: str, movie_id: str | None, top_k: int) -> list[SourceChunk]:
        resolved_movie_id, movie_title, omdb_data = self.infer_movie(question, movie_id)
        normalized_question = normalize_text(question)
        query_terms = set(normalized_question.split())
        candidates = [
            chunk for chunk in KNOWLEDGE_CHUNKS if resolved_movie_id is None or chunk.movie_id == resolved_movie_id
        ]
        vector_hits = vector_store.search(question, movie_id=resolved_movie_id, top_k=top_k)
        candidates = self.build_omdb_chunks(resolved_movie_id, movie_title, omdb_data) + vector_hits + candidates

        scored_chunks: list[SourceChunk] = []
        for chunk in candidates:
            chunk_terms = set(normalize_text(chunk.text).split())
            overlap = len(query_terms.intersection(chunk_terms))
            intent_boost = 0.0
            chunk_text = chunk.text.lower()
            if any(word in normalized_question for word in ["rating", "score", "imdb", "rated"]):
                intent_boost += 0.12 if any(word in chunk_text for word in ["rating", "imdb", "metascore"]) else 0
            if any(word in normalized_question for word in ["shoot", "filmed", "location", "where"]):
                intent_boost += 0.08 if any(word in chunk_text for word in ["filmed", "locations", "canada", "jordan", "london"]) else 0
            if any(word in normalized_question for word in ["hero", "actor", "cast", "character", "lead"]):
                intent_boost += 0.08 if any(word in chunk_text for word in ["actors", "stars", "character", "lead"]) else 0
            score = min(1.0, chunk.score + overlap * 0.01 + intent_boost)
            scored_chunks.append(chunk.model_copy(update={"score": score}))

        return sorted(scored_chunks, key=lambda chunk: chunk.score, reverse=True)[:top_k]

    def build_fallback_answer(self, question: str, sources: list[SourceChunk]) -> str:
        context = " ".join(source.text for source in sources[:3])
        return f"I found this movie context: {context}"

    def generate_openai_answer(self, question: str, sources: list[SourceChunk]) -> str | None:
        if not settings.openai_api_key:
            return None

        context = "\n".join(f"- {source.movie_title}: {source.text}" for source in sources)
        client = OpenAI(api_key=settings.openai_api_key)

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are Moviora AI, a natural movie assistant. "
                        "Use the retrieved context first. Answer greetings normally. "
                        "For movie facts, give the direct answer and mention if the project knowledge base is limited. "
                        "If OMDb ratings are present, use them for rating questions. "
                        "Do not reply with a generic menu unless the user asks what they can ask."
                    ),
                },
                {"role": "user", "content": f"Retrieved context:\n{context}\n\nQuestion: {question}"},
            ],
            temperature=0.35,
            max_tokens=420,
        )

        return response.choices[0].message.content

    def answer(self, request: ChatRequest) -> ChatResponse:
        sources = self.retrieve(request.question, request.movie_id, request.top_k)

        try:
            answer = self.generate_openai_answer(request.question, sources)
        except Exception as exc:
            answer = f"OpenAI request failed: {exc}. {self.build_fallback_answer(request.question, sources)}"

        if not answer:
            answer = self.build_fallback_answer(request.question, sources)

        return ChatResponse(answer=answer, sources=sources)

    def recommend(self, request: RecommendationRequest) -> RecommendationResponse:
        preference = request.preference.lower()
        recommendations = [
            Recommendation(title="Interstellar", reason="Strong fit for emotional science fiction, sacrifice, time, and family stakes.", confidence=0.93 if "time" in preference or "emotional" in preference else 0.81),
            Recommendation(title="Arrival", reason="Best fit for quiet, intelligent sci-fi with grief, communication, and memory.", confidence=0.9 if "emotional" in preference or "story" in preference else 0.78),
            Recommendation(title="Dune: Part Two", reason="Recommended for epic scale, political tension, world-building, and intense atmosphere.", confidence=0.82),
        ]
        return RecommendationResponse(recommendations=recommendations[: request.top_k])


rag_service = RagService()


