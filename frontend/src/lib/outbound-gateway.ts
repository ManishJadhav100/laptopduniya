export type GatewayLinkType = "retailer" | "deal" | "coupon";

type SearchParamValue = string | string[] | undefined;

export type GatewaySearchParams = Record<string, SearchParamValue>;

export interface OutboundGatewayPayload {
  targetUrl: string;
  title?: string;
  brandName?: string;
  storeName?: string;
  couponCode?: string;
  linkType?: GatewayLinkType;
}

const LAPTOP_GATEWAY_FLAG = "1";

function getFirstQueryValue(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function setOptionalQueryValue(
  params: URLSearchParams,
  key: string,
  value?: string,
) {
  if (value) {
    params.set(key, value);
  }
}

export function sanitizeExternalUrl(value?: string | null): string | null {
  if (!value) return null;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function buildOutboundGatewayQuery(
  payload: OutboundGatewayPayload,
  options?: { includeLaptopGatewayFlag?: boolean },
): string {
  const safeTarget = sanitizeExternalUrl(payload.targetUrl);
  const params = new URLSearchParams();

  if (!safeTarget) return params.toString();

  if (options?.includeLaptopGatewayFlag) {
    params.set("gateway", LAPTOP_GATEWAY_FLAG);
  }

  params.set("target", safeTarget);
  setOptionalQueryValue(params, "title", payload.title);
  setOptionalQueryValue(params, "brand", payload.brandName);
  setOptionalQueryValue(params, "store", payload.storeName);
  setOptionalQueryValue(params, "code", payload.couponCode);
  setOptionalQueryValue(params, "type", payload.linkType);

  return params.toString();
}

export function buildOutboundGatewayUrl(payload: OutboundGatewayPayload): string {
  const query = buildOutboundGatewayQuery(payload);
  return query ? `/go?${query}` : "#";
}

export function buildOutboundGatewayStepTwoUrl(
  payload: OutboundGatewayPayload,
): string {
  const query = buildOutboundGatewayQuery(payload);
  return query ? `/go/final?${query}` : "#";
}

export function buildShortCodeEntryUrl(shortCode: string): string {
  return `/go/${encodeURIComponent(shortCode)}`;
}

export function buildShortCodeStepTwoUrl(shortCode: string): string {
  return `/go/${encodeURIComponent(shortCode)}/final`;
}

export function isGatewayFinalPathname(pathname: string): boolean {
  return pathname === "/go/final" || /^\/go\/[^/]+\/final$/.test(pathname);
}

export function normalizeGatewayAccessPath(path: string): string | null {
  if (!path.startsWith("/")) return null;

  try {
    const url = new URL(path, "http://localhost");

    if (!isGatewayFinalPathname(url.pathname)) {
      return null;
    }

    const sortedEntries = [...url.searchParams.entries()].sort(([aKey, aValue], [bKey, bValue]) => {
      if (aKey === bKey) {
        return aValue.localeCompare(bValue);
      }

      return aKey.localeCompare(bKey);
    });
    const normalizedParams = new URLSearchParams();

    sortedEntries.forEach(([key, value]) => {
      normalizedParams.append(key, value);
    });

    const normalizedQuery = normalizedParams.toString();

    return normalizedQuery
      ? `${url.pathname}?${normalizedQuery}`
      : url.pathname;
  } catch {
    return null;
  }
}

export function buildLaptopGatewayPath(
  slug: string,
  payload: OutboundGatewayPayload,
): string {
  const query = buildOutboundGatewayQuery(payload, {
    includeLaptopGatewayFlag: true,
  });

  return query ? `/laptops/${slug}?${query}` : `/laptops/${slug}`;
}

export function buildLaptopGatewayPathFromCode(slug: string, shortCode: string): string {
  const params = new URLSearchParams({
    gateway: LAPTOP_GATEWAY_FLAG,
    short_code: shortCode,
  });

  return `/laptops/${slug}?${params.toString()}`;
}

export function parseOutboundGatewayPayload(
  searchParams: GatewaySearchParams,
): OutboundGatewayPayload | null {
  const targetUrl = sanitizeExternalUrl(getFirstQueryValue(searchParams.target));

  if (!targetUrl) return null;

  const linkType = getFirstQueryValue(searchParams.type);

  return {
    targetUrl,
    title: getFirstQueryValue(searchParams.title),
    brandName: getFirstQueryValue(searchParams.brand),
    storeName: getFirstQueryValue(searchParams.store),
    couponCode: getFirstQueryValue(searchParams.code),
    linkType:
      linkType === "retailer" || linkType === "deal" || linkType === "coupon"
        ? linkType
        : undefined,
  };
}

export function isLaptopGatewayRequest(searchParams: GatewaySearchParams): boolean {
  return getFirstQueryValue(searchParams.gateway) === LAPTOP_GATEWAY_FLAG;
}

export function getShortCodeFromSearchParams(
  searchParams: GatewaySearchParams,
): string | undefined {
  return getFirstQueryValue(searchParams.short_code);
}
