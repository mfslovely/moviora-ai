"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { MovieCard } from "@/components/movie-card";
import type { Movie } from "@/lib/movies";

export function MovieSearch({ movies }: { movies: Movie[] }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return movies;
    }

    return movies.filter((movie) => {
      const searchableText = [
        movie.title,
        movie.year,
        movie.overview,
        movie.audienceSignal,
        ...movie.genres
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [movies, query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return;
    }

    const exactMovie = movies.find((movie) => movie.title.toLowerCase() === normalizedQuery);
    if (exactMovie) {
      router.push(`/movie/${exactMovie.id}`);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex max-w-2xl items-center gap-3 rounded-md border border-white/12 bg-ink/78 p-2 shadow-glow"
      >
        <Search className="ml-3 shrink-0 text-white/45" size={22} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-white outline-none placeholder:text-white/38"
          placeholder="Search Interstellar, Dune, K3G..."
        />
        <button className="rounded bg-ember px-5 py-3 font-medium text-white transition hover:bg-orange-600">
          Analyze
        </button>
      </form>

      {query.trim() ? (
        <div className="mt-6 max-w-2xl rounded-md border border-white/10 bg-ink/84 p-4 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/48">Search results</p>
              <h2 className="text-xl font-semibold">
                {filteredMovies.length ? `${filteredMovies.length} match found` : "No local match yet"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded border border-white/10 px-3 py-2 text-sm text-white/62 hover:text-white"
            >
              Clear
            </button>
          </div>

          {filteredMovies.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <p className="leading-7 text-white/64">
              This demo library has a few sample films. Next we can connect TMDb search so any movie name works live.
            </p>
          )}
        </div>
      ) : null}
    </>
  );
}
