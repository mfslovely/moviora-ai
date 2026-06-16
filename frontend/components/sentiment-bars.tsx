import type { Movie } from "@/lib/movies";

export function SentimentBars({ movie }: { movie: Movie }) {
  const rows = [
    ["Positive", movie.sentiment.positive, "bg-mint"],
    ["Neutral", movie.sentiment.neutral, "bg-saffron"],
    ["Negative", movie.sentiment.negative, "bg-ember"]
  ] as const;

  return (
    <div className="space-y-4">
      {rows.map(([label, value, color]) => (
        <div key={label}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-white/70">{label}</span>
            <span className="font-medium">{value}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
