import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/movie-api";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") ?? "";

  try {
    const movies = await searchMovies(query);
    return NextResponse.json(movies);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Movie search failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
