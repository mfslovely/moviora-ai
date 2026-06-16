import Image from "next/image";
import { notFound } from "next/navigation";
import { Bot, Clock, MessageSquareText, Star } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { SentimentBars } from "@/components/sentiment-bars";
import { movies } from "@/lib/movies";

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = movies.find((item) => item.id === id);

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="poster-fade absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-9 px-5 py-14 lg:grid-cols-[330px_1fr]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-white/12 shadow-glow">
            <Image src={movie.poster} alt={`${movie.title} poster`} fill className="object-cover" priority />
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
              <button className="flex items-center gap-2 rounded bg-ember px-5 py-3 font-medium text-white">
                <Bot size={18} />
                Ask AI
              </button>
              <button className="flex items-center gap-2 rounded border border-white/14 px-5 py-3 text-white/80">
                <MessageSquareText size={18} />
                Analyze Reviews
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-md border border-white/10 bg-white/[0.045] p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-ember">AI summary</p>
          <h2 className="mt-2 text-2xl font-semibold">Audience signal</h2>
          <p className="mt-4 leading-8 text-white/70">{movie.audienceSignal}</p>
          <div className="mt-5 rounded border border-mint/20 bg-mint/10 p-4 text-sm leading-6 text-white/74">
            In production, this panel is generated from top-k retrieved review chunks stored in Chroma
            or Pinecone, then grounded by the LLM response.
          </div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.045] p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-ember">Review sentiment</p>
          <h2 className="mt-2 text-2xl font-semibold">What viewers felt</h2>
          <div className="mt-6">
            <SentimentBars movie={movie} />
          </div>
        </div>
      </section>
    </main>
  );
}
