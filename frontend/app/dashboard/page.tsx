import { BarChart3, Bookmark, Database, MessageSquareText } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { movies } from "@/lib/movies";

const stats = [
  { label: "Saved movies", value: "18", icon: Bookmark },
  { label: "Chat sessions", value: "42", icon: MessageSquareText },
  { label: "Indexed chunks", value: "14K", icon: Database },
  { label: "Avg sentiment", value: "73%", icon: BarChart3 }
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-ember">Portfolio dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold">User intelligence hub</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-md border border-white/10 bg-white/[0.045] p-5">
                <Icon className="text-saffron" size={22} />
                <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm text-white/52">{stat.label}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <section className="rounded-md border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-semibold">Watchlist signals</h2>
            <div className="mt-5 space-y-3">
              {movies.map((movie) => (
                <div key={movie.id} className="flex items-center justify-between rounded border border-white/10 bg-ink/70 p-4">
                  <div>
                    <p className="font-medium">{movie.title}</p>
                    <p className="mt-1 text-sm text-white/48">{movie.genres.join(" · ")}</p>
                  </div>
                  <span className="rounded bg-mint/12 px-3 py-1 text-sm text-mint">
                    {movie.sentiment.positive}% positive
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-md border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-semibold">Next recommendations</h2>
            <div className="mt-5 space-y-4 text-white/70">
              <p>Because your watchlist leans toward cerebral sci-fi and emotional stakes:</p>
              <ul className="space-y-3">
                <li className="rounded border border-white/10 bg-ink/70 p-3">Blade Runner 2049</li>
                <li className="rounded border border-white/10 bg-ink/70 p-3">The Martian</li>
                <li className="rounded border border-white/10 bg-ink/70 p-3">Ex Machina</li>
              </ul>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
