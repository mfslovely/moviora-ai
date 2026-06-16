import json
import math
import re
from collections import Counter
from pathlib import Path
from uuid import uuid4

from app.core.config import settings
from app.schemas.ai import SourceChunk


class LocalVectorStore:
    def __init__(self) -> None:
        self.path = Path(settings.vector_db_path) / "movie_chunks.json"
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def tokenize(self, text: str) -> list[str]:
        return re.findall(r"[a-z0-9]+", text.lower())

    def embed(self, text: str) -> Counter[str]:
        return Counter(self.tokenize(text))

    def cosine(self, left: Counter[str], right: Counter[str]) -> float:
        if not left or not right:
            return 0.0
        common = set(left).intersection(right)
        dot = sum(left[token] * right[token] for token in common)
        left_norm = math.sqrt(sum(value * value for value in left.values()))
        right_norm = math.sqrt(sum(value * value for value in right.values()))
        if not left_norm or not right_norm:
            return 0.0
        return dot / (left_norm * right_norm)

    def load(self) -> list[dict]:
        if not self.path.exists():
            return []
        try:
            return json.loads(self.path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return []

    def save(self, records: list[dict]) -> None:
        self.path.write_text(json.dumps(records, indent=2), encoding="utf-8")

    def upsert(self, movie_id: str, movie_title: str, texts: list[str], source: str = "omdb") -> int:
        records = self.load()
        existing_keys = {(item["movie_id"], item["text"]) for item in records}
        added = 0

        for text in texts:
            cleaned = text.strip()
            if not cleaned or (movie_id, cleaned) in existing_keys:
                continue
            records.append(
                {
                    "id": str(uuid4()),
                    "movie_id": movie_id,
                    "movie_title": movie_title,
                    "text": cleaned,
                    "source": source,
                }
            )
            existing_keys.add((movie_id, cleaned))
            added += 1

        self.save(records)
        return added

    def search(self, query: str, movie_id: str | None = None, top_k: int = 5) -> list[SourceChunk]:
        query_vector = self.embed(query)
        scored: list[SourceChunk] = []

        for record in self.load():
            if movie_id and record["movie_id"] != movie_id:
                continue
            score = self.cosine(query_vector, self.embed(record["text"]))
            if score <= 0:
                continue
            scored.append(
                SourceChunk(
                    movie_id=record["movie_id"],
                    movie_title=record["movie_title"],
                    text=record["text"],
                    score=min(1.0, score),
                )
            )

        return sorted(scored, key=lambda chunk: chunk.score, reverse=True)[:top_k]


vector_store = LocalVectorStore()
