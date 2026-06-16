import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Movie } from "@/lib/movies";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group overflow-hidden rounded-md border border-white/10 bg-white/[0.045] transition hover:-translate-y-1 hover:border-ember/50 hover:bg-white/[0.07]"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={movie.poster}
          alt={`${movie.title} poster`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-tight">{movie.title}</h3>
            <p className="mt-1 text-sm text-white/52">{movie.year} · {movie.runtime}</p>
          </div>
          <span className="flex items-center gap-1 rounded bg-saffron/15 px-2 py-1 text-sm text-saffron">
            <Star size={14} fill="currentColor" />
            {movie.rating}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {movie.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="rounded border border-white/10 px-2 py-1 text-xs text-white/62">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
