import Link from "next/link";
import { notFound } from "next/navigation";
import { Bot, Clock, MessageSquareText, Star, Users } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { SaveMovieButton } from "@/components/save-movie-button";
import { PosterImage } from "@/components/poster-image";
import { SentimentBars } from "@/components/sentiment-bars";
import { getMovie } from "@/lib/movie-api";

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let movie;

  try {
    movie = await getMovie(id);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 blur-sm"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="poster-fade absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-9 px-5 py-14 lg:grid-cols-[330px_1fr]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-white/12 shadow-glow">
            <PosterImage src={movie.poster} alt={`${movie.title} poster`} className="object-cover" priority />
          </div>
          <div className="flex flex-col justify-end pb-2">
            <div className="mb-5 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span key={genre} className="rounded border border-white/12 bg-white/[0.06] px-3 py-1 text-sm">
                  {genre}
                </span>
              ))}
            </div>
            <h1 className="text-5xl font-semibold leading-tight md:text-7xl">{movie.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-white/70">
              <span>{movie.year}</span>
              <span className="flex items-center gap-2"><Clock size={17} /> {movie.runtime}</span>
              <span className="flex items-center gap-2 text-saffron"><Star size={17} fill="currentColor" /> {movie.rating}</span>
            </div>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/74">{movie.overview}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/assistant?movieId=${movie.id}&question=${encodeURIComponent(`Tell me about ${movie.title}`)}`}
                className="flex items-center gap-2 rounded bg-ember px-5 py-3 font-medium text-white"
              >
                <Bot size={18} />
                Ask AI
              </Link>
              <SaveMovieButton movie={movie} />
              <Link
                href={`/assistant?movieId=${movie.id}&question=${encodeURIComponent(`What is the rating, cast, and story of ${movie.title}?`)}`}
                className="flex items-center gap-2 rounded border border-white/14 px-5 py-3 text-white/80"
              >
                <MessageSquareText size={18} />
                Analyze Details
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-md border border-white/10 bg-white/[0.045] p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-ember">OMDb facts</p>
          <h2 className="mt-2 text-2xl font-semibold">Movie intelligence context</h2>
          <p className="mt-4 leading-8 text-white/70">{movie.audienceSignal}</p>
          {movie.cast.length ? (
            <div className="mt-5 rounded border border-white/10 bg-ink/70 p-4">
              <div className="mb-3 flex items-center gap-2 text-white/80">
                <Users size={18} />
                <span className="font-medium">Cast</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.cast.slice(0, 8).map((actor) => (
                  <span key={actor} className="rounded border border-white/10 px-3 py-1 text-sm text-white/68">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-5 rounded border border-mint/20 bg-mint/10 p-4 text-sm leading-6 text-white/74">
            This page can be loaded from OMDb by IMDb ID, then passed to the AI assistant for grounded answers.
          </div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.045] p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-ember">Audience estimate</p>
          <h2 className="mt-2 text-2xl font-semibold">What viewers felt</h2>
          <div className="mt-6">
            <SentimentBars movie={movie} />
          </div>
        </div>
      </section>
    </main>
  );
}


