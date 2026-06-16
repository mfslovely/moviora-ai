import type { Movie } from "@/lib/movies";

const BACKEND_URLS = [
  process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1",
  "http://127.0.0.1:8001/api/v1"
];

export function toMovie(data: any): Movie {
  return {
    id: data.id,
    title: data.title,
    year: data.year,
    rating: data.rating,
    runtime: data.runtime,
    genres: data.genres ?? [],
    cast: data.cast ?? [],
    poster: data.poster,
    backdrop: data.backdrop,
    overview: data.overview,
    audienceSignal: data.audience_signal ?? data.audienceSignal,
    sentiment: data.sentiment ?? { positive: 70, neutral: 20, negative: 10 }
  };
}

export async function backendFetch(path: string) {
  let lastError = "Backend unavailable";

  for (const baseUrl of BACKEND_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
      const text = await response.text();

      if (!response.ok) {
        lastError = text || `Backend returned ${response.status}`;
        continue;
      }

      return JSON.parse(text);
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Backend unavailable";
    }
  }

  throw new Error(lastError);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const data = await backendFetch(`/movies/search?query=${encodeURIComponent(query)}`);
  return data.map(toMovie);
}

export async function getMovie(id: string): Promise<Movie> {
  const data = await backendFetch(`/movies/${encodeURIComponent(id)}`);
  return toMovie(data);
}
