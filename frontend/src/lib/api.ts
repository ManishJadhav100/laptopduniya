type ApiFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  timeoutMs?: number;
};

const DEFAULT_API_TIMEOUT_MS = 5000;
const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function getApiBaseUrl() {
  const isServer = typeof window === "undefined";
  const baseUrl = isServer
    ? process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      DEFAULT_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export const getApiUrl = (path: string = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${cleanPath}`;
};

async function fetchJsonWithTimeout<T>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<T | null> {
  const { timeoutMs = DEFAULT_API_TIMEOUT_MS, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(`[API ${response.status}] ${url}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(`[API timeout after ${timeoutMs}ms] ${url}`);
      return null;
    }

    console.warn(`[API request failed] ${url}`, error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function toResultsArray<T>(
  data: T[] | { results?: T[] } | null | undefined,
): T[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}

export async function fetchApiJson<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T | null> {
  return fetchJsonWithTimeout<T>(getApiUrl(path), options);
}

export async function fetchApiList<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T[]> {
  const data = await fetchApiJson<T[] | { results?: T[] }>(path, options);
  return toResultsArray<T>(data);
}

export async function fetchAbsoluteJson<T>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<T | null> {
  return fetchJsonWithTimeout<T>(url, options);
}

export async function fetchAbsoluteList<T>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<T[]> {
  const data = await fetchAbsoluteJson<T[] | { results?: T[] }>(url, options);
  return toResultsArray<T>(data);
}
