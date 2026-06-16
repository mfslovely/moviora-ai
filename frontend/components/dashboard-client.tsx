"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, Clapperboard, LogOut, MessageSquareText, Sparkles } from "lucide-react";
import { clearCurrentUser, getCurrentUser, type CurrentUser } from "@/lib/auth";
import { PosterImage } from "@/components/poster-image";

type SavedMovie = {
  id: number;
  user_id: number;
  movie_id: string;
  title: string;
  poster: string;
  rating: string;
};

type ChatSession = {
  id: number;
  user_id: number | null;
  movie_id: string | null;
  title: string;
};

export function DashboardClient() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const userId = currentUser.id;

    async function loadData() {
      try {
        const [watchlistResponse, sessionsResponse] = await Promise.all([
          fetch(`/api/db/watchlist/${userId}`),
          fetch(`/api/db/users/${userId}/chat-sessions`)
        ]);

        const watchlist = watchlistResponse.ok ? await watchlistResponse.json() : [];
        const sessions = sessionsResponse.ok ? await sessionsResponse.json() : [];

        setSavedMovies(watchlist);
        setChatSessions(sessions);
        setHasLoadError(false);
      } catch {
        setHasLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, []);

  function signOut() {
    clearCurrentUser();
    setUser(null);
    setSavedMovies([]);
    setChatSessions([]);
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="rounded-md border border-white/10 bg-white/[0.045] p-8">
          <p className="text-sm uppercase tracking-[0.18em] text-ember">Your Library</p>
          <h1 className="mt-3 text-4xl font-semibold">Save movies to your own space</h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/66">
            Create a simple profile to keep a personal watchlist and revisit your AI movie conversations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded bg-ember px-5 py-3 font-medium text-white">
              Sign up
            </Link>
            <Link href="/" className="rounded border border-white/12 px-5 py-3 text-white/76 hover:text-white">
              Search movies
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const stats = [
    { label: "Saved movies", value: savedMovies.length, icon: Bookmark },
    { label: "AI conversations", value: chatSessions.length, icon: MessageSquareText },
    { label: "Top rating", value: savedMovies.length ? Math.max(...savedMovies.map((movie) => Number(movie.rating) || 0)).toFixed(1) : "--", icon: Sparkles },
    { label: "Profile", value: "Active", icon: Clapperboard }
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-ember">Your Library</p>
          <h1 className="mt-2 text-4xl font-semibold">Welcome back, {user.name}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-white/58">
            Your saved films and AI conversations live here, so you can continue exploring without starting over.
          </p>
          {hasLoadError ? (
            <p className="mt-3 text-sm text-saffron">Some library data could not be loaded. Please refresh after the backend is running.</p>
          ) : null}
        </div>
        <button onClick={signOut} className="flex items-center gap-2 rounded border border-white/12 px-4 py-3 text-white/70 hover:text-white">
          <LogOut size={18} />
          Sign out
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-md border border-white/10 bg-white/[0.045] p-5">
              <Icon className="text-saffron" size={22} />
              <p className="mt-4 text-3xl font-semibold">{isLoading ? "..." : stat.value}</p>
              <p className="mt-1 text-sm text-white/52">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <section className="rounded-md border border-white/10 bg-white/[0.045] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Saved movies</h2>
            <Link href="/" className="rounded border border-white/10 px-3 py-2 text-sm text-white/64 hover:text-white">
              Add more
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {savedMovies.length ? savedMovies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.movie_id}`} className="flex items-center gap-4 rounded border border-white/10 bg-ink/70 p-3 transition hover:border-ember/50">
                {movie.poster ? (
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded border border-white/10">
                    <PosterImage src={movie.poster} alt={`${movie.title} poster`} className="object-cover" />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{movie.title}</p>
                  <p className="mt-1 text-sm text-white/48">Saved to your watchlist</p>
                </div>
                <span className="rounded bg-saffron/12 px-3 py-1 text-sm text-saffron">{movie.rating}</span>
              </Link>
            )) : (
              <p className="rounded border border-white/10 bg-ink/70 p-4 text-white/58">
                No saved movies yet. Search a movie, open its detail page, and click Save Movie.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-md border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-2xl font-semibold">Recent AI chats</h2>
          <div className="mt-5 space-y-3">
            {chatSessions.length ? chatSessions.slice(0, 8).map((session) => (
              <div key={session.id} className="rounded border border-white/10 bg-ink/70 p-4">
                <p className="font-medium">{session.title}</p>
                <p className="mt-1 text-sm text-white/48">Movie assistant conversation</p>
              </div>
            )) : (
              <p className="rounded border border-white/10 bg-ink/70 p-4 text-white/58">
                No AI chats saved yet. Ask the assistant about a movie to start one.
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}




