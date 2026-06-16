import { Bot, BrainCircuit, Search, Sparkles, TrendingUp } from "lucide-react";
import { MovieCard } from "@/components/movie-card";
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
              <BrainCircuit size={16} />
              RAG-powered movie intelligence platform
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
              Moviora AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              Search films, analyze audience reviews, ask grounded questions, and get explainable
              recommendations from a movie knowledge base.
            </p>
            <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-md border border-white/12 bg-ink/78 p-2 shadow-glow">
              <Search className="ml-3 text-white/45" size={22} />
              <input
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-white outline-none placeholder:text-white/38"
                placeholder="Search Interstellar, Dune, Arrival..."
              />
              <button className="rounded bg-ember px-5 py-3 font-medium text-white transition hover:bg-orange-600">
                Analyze
              </button>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ["14K", "review chunks"],
                ["92%", "answer confidence"],
                ["3.2s", "avg retrieval"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-md border border-white/10 bg-white/[0.055] p-4">
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-sm text-white/52">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="self-end rounded-md border border-white/12 bg-ink/76 p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/48">Featured insight</p>
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
            <p className="text-sm uppercase tracking-[0.18em] text-ember">Trending library</p>
            <h2 className="mt-2 text-3xl font-semibold">Movies ready for analysis</h2>
          </div>
          <div className="hidden items-center gap-2 text-sm text-white/52 md:flex">
            <Bot size={18} />
            Grounded AI summaries from retrieved context
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
