import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Prefer server-only BACKEND_API_URL, fallback to public NEXT_PUBLIC_API_URL, or localhost
    const rawApiUrl =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://127.0.0.1:8000";

    const baseUrl = rawApiUrl.replace(/\/+$/, "");
    const primaryEndpoint = `${baseUrl}/api/v1/match`;

    const isProduction = process.env.NODE_ENV === "production";

    // In production, strictly call the configured backend endpoint.
    // In local development, allow fallback to common local addresses.
    const endpoints = isProduction
      ? [primaryEndpoint]
      : Array.from(new Set([primaryEndpoint, "http://127.0.0.1:8000/api/v1/match", "http://localhost:8000/api/v1/match"]));

    let lastError: any = null;

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        } else {
          const errorText = await response.text();
          return NextResponse.json(
            { error: `Backend returned error (${response.status}): ${errorText}` },
            { status: response.status }
          );
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    const failureReason =
      lastError?.name === "AbortError"
        ? "Backend service request timed out (it may be waking up from cold start on free-tier hosting)."
        : lastError?.message || "Connection refused";

    return NextResponse.json(
      {
        error: `Could not reach backend engine (${baseUrl}): ${failureReason}`,
        target: primaryEndpoint,
      },
      { status: 502 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

