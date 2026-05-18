import { NextRequest } from "next/server";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function getBackendShortenerUrl() {
  const apiBaseUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_API_BASE_URL;
  const normalizedBaseUrl = apiBaseUrl.replace(/\/$/, "");
  const backendRoot = normalizedBaseUrl.replace(/\/api\/v1$/, "");

  return `${backendRoot}/api`;
}

export async function GET(request: NextRequest) {
  const targetUrl = new URL(getBackendShortenerUrl());
  targetUrl.search = request.nextUrl.searchParams.toString();

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: "GET",
      headers: {
        origin: request.nextUrl.origin,
        referer: request.url,
        "x-forwarded-host": request.nextUrl.host,
        "x-forwarded-proto": request.nextUrl.protocol.replace(":", ""),
      },
      cache: "no-store",
    });

    return new Response(await upstreamResponse.arrayBuffer(), {
      status: upstreamResponse.status,
      headers: {
        "content-type":
          upstreamResponse.headers.get("content-type") ||
          "application/json; charset=utf-8",
      },
    });
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Unable to reach the shortener service right now.",
      },
      { status: 502 },
    );
  }
}
