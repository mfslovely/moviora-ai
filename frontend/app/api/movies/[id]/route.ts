import { NextRequest, NextResponse } from "next/server";
import { getMovie } from "@/lib/movie-api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const movie = await getMovie(id);
    return NextResponse.json(movie);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Movie not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
