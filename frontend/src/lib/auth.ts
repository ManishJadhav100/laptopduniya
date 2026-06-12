export interface AuthUser {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthPayload {
  user: AuthUser;
  api_key: string;
  tokens?: AuthTokens;
}

export interface AuthSession {
  user: AuthUser;
  apiKey: string;
  tokens: AuthTokens;
}

const AUTH_STORAGE_KEY = "phoneradar-auth-session";

function getFirstErrorMessage(
  value: unknown,
  fallbackMessage: string,
): string {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    return getFirstErrorMessage(value[0], fallbackMessage);
  }

  if (value && typeof value === "object") {
    const firstValue = Object.values(value)[0];
    return getFirstErrorMessage(firstValue, fallbackMessage);
  }

  return fallbackMessage;
}

export function toAuthSession(payload: AuthPayload): AuthSession {
  if (!payload.tokens?.access || !payload.tokens?.refresh) {
    throw new Error("Authentication tokens were not returned by the server.");
  }

  return {
    user: payload.user,
    apiKey: payload.api_key,
    tokens: payload.tokens,
  };
}

export function mergeAuthPayload(
  session: AuthSession,
  payload: AuthPayload,
): AuthSession {
  return {
    user: payload.user,
    apiKey: payload.api_key,
    tokens: payload.tokens ?? session.tokens,
  };
}

export function readStoredAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as AuthSession;
    if (
      parsedValue?.tokens?.access &&
      parsedValue?.tokens?.refresh &&
      parsedValue?.user?.username &&
      parsedValue?.apiKey
    ) {
      return parsedValue;
    }
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return null;
}

export function writeStoredAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function readApiError(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const data = (await response.json()) as Record<string, unknown>;
    return getFirstErrorMessage(
      data.detail ?? data.message ?? data.non_field_errors ?? data,
      fallbackMessage,
    );
  } catch {
    return fallbackMessage;
  }
}
