import { NextRequest, NextResponse } from "next/server";
import {
  createGatewayAccessToken,
  GATEWAY_ACCESS_COOKIE_NAME,
  GATEWAY_ACCESS_TTL_SECONDS,
} from "@/lib/gateway-access.server";
import { normalizeGatewayAccessPath } from "@/lib/outbound-gateway";

/**
 * Allowed frontend origins
 */
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://laptopduniya.in",
  "https://www.laptopduniya.in",
];

/**
 * Validate request origin
 * More reliable than Referer in production
 */
function hasValidOrigin(origin: string | null) {
  if (!origin) return false;

  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Optional GET handler
 * Useful for testing deployment
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Gateway API working",
  });
}

/**
 * Main POST handler
 */
export async function POST(request: NextRequest) {
  /**
   * Validate request origin
   */
  const origin = request.headers.get("origin");

  if (
    process.env.NODE_ENV === "production" &&
    !hasValidOrigin(origin)
  ) {
    return NextResponse.json(
      {
        detail: "Invalid origin",
      },
      {
        status: 403,
      }
    );
  }

  /**
   * Parse request body
   */
  let body: { path?: string } | null = null;

  try {
    body = (await request.json()) as { path?: string };
  } catch {
    return NextResponse.json(
      {
        detail: "Invalid request body.",
      },
      {
        status: 400,
      }
    );
  }

  /**
   * Validate target path
   */
  const normalizedPath = normalizeGatewayAccessPath(body?.path || "");

  if (!normalizedPath) {
    return NextResponse.json(
      {
        detail: "Invalid final gateway path.",
      },
      {
        status: 400,
      }
    );
  }

  /**
   * Create secure access token
   */
  const token = createGatewayAccessToken(normalizedPath);

  if (!token) {
    return NextResponse.json(
      {
        detail: "Unable to create gateway access token.",
      },
      {
        status: 500,
      }
    );
  }

  /**
   * Build response
   */
  const response = NextResponse.json({
    ok: true,
  });

  /**
   * Set secure cookie
   */
  response.cookies.set({
    name: GATEWAY_ACCESS_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: GATEWAY_ACCESS_TTL_SECONDS,
    path: "/",
  });

  return response;
}