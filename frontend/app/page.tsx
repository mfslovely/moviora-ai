import { Bot, Bookmark, Search, Sparkles, TrendingUp } from "lucide-react";
import { MovieCard } from "@/components/movie-card";
import { MovieSearch } from "@/components/movie-search";
import { Navigation } from "@/components/navigation";
import { assistantPrompts, movies } from "@/lib/movies";

export default function Home() {
  const hero = movies[1];

  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${hero.backdrop})` }}
        />
        <div className="poster-fade absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.12fr_0.88fr] lg:py-24">
          <div className="flex min-h-[440px] flex-col justify-center">
            <div className="mb-6 flex w-fit items-center gap-2 rounded border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-white/74">
              <Sparkles size={16} />
              Your personal movie discovery assistant
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
              Moviora AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              Find movies, understand stories, compare favorites, and save the films you want to watch next.
            </p>
            <MovieSearch movies={movies} />
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ["Search", "movies instantly", Search],
                ["Ask", "the AI assistant", Bot],
                ["Save", "your watchlist", Bookmark]
              ].map(([value, label, Icon]) => (
                <div key={label as string} className="rounded-md border border-white/10 bg-white/[0.055] p-4">
                  <Icon className="text-saffron" size={22} />
                  <p className="mt-3 text-2xl font-semibold">{value as string}</p>
                  <p className="mt-1 text-sm text-white/52">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="self-end rounded-md border border-white/12 bg-ink/76 p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/48">Featured pick</p>
                <h2 className="text-2xl font-semibold">{hero.title}</h2>
              </div>
              <TrendingUp className="text-mint" />
            </div>
            <p className="leading-7 text-white/70">{hero.audienceSignal}</p>
            <div className="mt-6 grid gap-3">
              {assistantPrompts.slice(0, 3).map((prompt) => (
                <div key={prompt} className="flex items-center gap-3 rounded border border-white/10 bg-white/[0.04] p-3">
                  <Sparkles size={16} className="text-saffron" />
                  <span className="text-sm text-white/72">{prompt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between gap-5">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-ember">Start exploring</p>
            <h2 className="mt-2 text-3xl font-semibold">Popular movies to try</h2>
          </div>
          <div className="hidden items-center gap-2 text-sm text-white/52 md:flex">
            <Bot size={18} />
            Ask questions after opening any movie
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </main>
  );
}
