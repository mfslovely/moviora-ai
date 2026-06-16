"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import type { Movie } from "@/lib/movies";

export function SaveMovieButton({ movie }: { movie: Movie }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error" | "no-user">("idle");

  async function saveMovie() {
    const user = getCurrentUser();
    if (!user) {
      setStatus("no-user");
      return;
    }

    setStatus("saving");

    try {
      const response = await fetch("/api/db/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title,
          poster: movie.poster,
          rating: movie.rating
        })
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  if (status === "no-user") {
    return (
      <Link href="/signup" className="flex items-center gap-2 rounded border border-white/14 px-5 py-3 text-white/80 transition hover:border-mint/50 hover:text-white">
        <Bookmark size={18} />
        Sign up to save
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={saveMovie}
      disabled={status === "saving" || status === "saved"}
      className="flex items-center gap-2 rounded border border-white/14 px-5 py-3 text-white/80 transition hover:border-mint/50 hover:text-white disabled:opacity-70"
    >
      {status === "saved" ? <Check size={18} /> : <Bookmark size={18} />}
      {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : status === "error" ? "Save failed" : "Save Movie"}
    </button>
  );
}
