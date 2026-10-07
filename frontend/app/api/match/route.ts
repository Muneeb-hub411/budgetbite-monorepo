import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const endpoints = [
      `${apiUrl}/api/v1/match`,
      "http://127.0.0.1:8000/api/v1/match",
      "http://localhost:8000/api/v1/match",
    ];

    let lastError = null;

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        } else {
          const errorText = await response.text();
          return NextResponse.json(
            { error: `Backend error: ${errorText}` },
            { status: response.status }
          );
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return NextResponse.json(
      { error: `Could not reach backend engine: ${lastError?.message}` },
      { status: 502 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
