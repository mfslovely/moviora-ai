import { NextRequest, NextResponse } from "next/server";

const BACKEND_URLS = [
  process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1",
  "http://127.0.0.1:8001/api/v1"
];

export async function proxyPost(path: string, request: NextRequest) {
  const payload = await request.text();
  return proxyRequest(path, { method: "POST", body: payload });
}

export async function proxyGet(path: string) {
  return proxyRequest(path, { method: "GET" });
}

async function proxyRequest(path: string, init: { method: "GET" | "POST"; body?: string }) {
  let lastError = "Backend unavailable";

  for (const baseUrl of BACKEND_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: init.method,
        headers: { "Content-Type": "application/json" },
        body: init.body
      });
      const text = await response.text();
      if (!response.ok) {
        lastError = text || `Backend returned ${response.status}`;
        continue;
      }
      return new NextResponse(text, { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Backend unavailable";
    }
  }

  return NextResponse.json({ error: lastError }, { status: 503 });
}
