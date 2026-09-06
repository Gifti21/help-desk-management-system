import { NextResponse } from "next/server";

export function withApiTiming(
  response: NextResponse,
  startedAt: number,
  route: string,
) {
  const durationMs = performance.now() - startedAt;
  response.headers.set("Server-Timing", `app;dur=${durationMs.toFixed(1)}`);
  response.headers.set("X-Response-Time-Ms", durationMs.toFixed(1));
  response.headers.set("X-Api-Route", route);
  return response;
}
