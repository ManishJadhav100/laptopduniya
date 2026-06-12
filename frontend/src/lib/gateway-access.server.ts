import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { normalizeGatewayAccessPath } from "@/lib/outbound-gateway";

export const GATEWAY_ACCESS_COOKIE_NAME = "ld_gateway_access";
export const GATEWAY_ACCESS_TTL_SECONDS = 5 * 60;

interface GatewayAccessTokenPayload {
  exp: number;
  path: string;
}

function getGatewayAccessSecret() {
  return (
    process.env.GATEWAY_ACCESS_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "phoneradar-gateway-dev-secret"
  );
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signGatewayPayload(encodedPayload: string) {
  return createHmac("sha256", getGatewayAccessSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function createGatewayAccessToken(path: string) {
  const normalizedPath = normalizeGatewayAccessPath(path);

  if (!normalizedPath) {
    return null;
  }

  const payload: GatewayAccessTokenPayload = {
    exp: Date.now() + GATEWAY_ACCESS_TTL_SECONDS * 1000,
    path: normalizedPath,
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signGatewayPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyGatewayAccessToken(token: string, path: string) {
  const normalizedPath = normalizeGatewayAccessPath(path);

  if (!normalizedPath) {
    return false;
  }

  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return false;
  }

  const expectedSignature = signGatewayPayload(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      decodeBase64Url(encodedPayload),
    ) as GatewayAccessTokenPayload;

    return payload.exp > Date.now() && payload.path === normalizedPath;
  } catch {
    return false;
  }
}
