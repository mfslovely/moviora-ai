"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { MovieCard } from "@/components/movie-card";
import type { Movie } from "@/lib/movies";

export function MovieSearch({ movies }: { movies: Movie[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const localFilteredMovies = useMemo(() => {
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
        ...movie.genres,
        ...movie.cast
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [movies, query]);

  const visibleMovies = query.trim() ? results ?? localFilteredMovies : movies;

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults(null);
      setError("");
      setIsLoading(false);
      return;
    }

    if (trimmedQuery.length < 2) {
      setResults(null);
      setError("");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/movies/search?query=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Movie search failed");
        }

        setResults(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setResults([]);
        setError(error instanceof Error ? error.message : "Movie search failed");
      } finally {
        setIsLoading(false);
      }
    }, 450);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function clearSearch() {
    setQuery("");
    setResults(null);
    setError("");
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
          placeholder="Search Titanic, Avatar, 3 Idiots..."
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded bg-ember px-5 py-3 font-medium text-white transition hover:bg-orange-600"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" size={17} /> : null}
          Search
        </button>
      </form>

      {query.trim() ? (
        <div className="mt-6 max-w-2xl rounded-md border border-white/10 bg-ink/84 p-4 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/48">Live OMDb results</p>
              <h2 className="text-xl font-semibold">
                {isLoading ? "Searching..." : visibleMovies.length ? `${visibleMovies.length} match found` : "No match found"}
              </h2>
            </div>
            <button
              type="button"
              onClick={clearSearch}
              className="rounded border border-white/10 px-3 py-2 text-sm text-white/62 hover:text-white"
            >
              Clear
            </button>
          </div>

          {error ? <p className="mb-4 rounded border border-ember/30 bg-ember/10 p-3 text-sm text-white/74">{error}</p> : null}

          {visibleMovies.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : !isLoading ? (
            <p className="leading-7 text-white/64">
              Try another title. OMDb works best with exact names like Titanic, Avatar, Inception, 3 Idiots, or The Dark Knight.
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
