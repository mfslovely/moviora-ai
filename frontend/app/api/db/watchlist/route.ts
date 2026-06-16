import { NextRequest } from "next/server";
import { proxyPost } from "../proxy";

export async function POST(request: NextRequest) {
  return proxyPost("/db/watchlist", request);
}
