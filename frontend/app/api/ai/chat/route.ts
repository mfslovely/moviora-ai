import { NextRequest, NextResponse } from "next/server";

const BACKEND_URLS = [
  process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1",
  "http://127.0.0.1:8001/api/v1"
];

export async function POST(request: NextRequest) {
  const payload = await request.text();
  let lastError = "Backend unavailable";

  for (const baseUrl of BACKEND_URLS) {
    try {
      const response = await fetch(`${baseUrl}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
      });

      const text = await response.text();
      if (!response.ok) {
        lastError = text || `Backend returned ${response.status}`;
        continue;
      }

      return new NextResponse(text, {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Backend unavailable";
    }
  }

  return NextResponse.json(
    { error: `AI backend is not reachable: ${lastError}` },
    { status: 503 }
  );
}
