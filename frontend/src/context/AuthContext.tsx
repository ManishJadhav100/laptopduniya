"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getApiUrl } from "@/lib/api";
import {
  type AuthPayload,
  type AuthSession,
  clearStoredAuthSession,
  mergeAuthPayload,
  readApiError,
  readStoredAuthSession,
  toAuthSession,
  writeStoredAuthSession,
} from "@/lib/auth";

interface AuthContextType {
  apiKey: string | null;
  fetchWithAuth: (path: string, init?: RequestInit) => Promise<Response>;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (input: { login: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
  register: (input: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  user: AuthSession["user"] | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function createJsonHeaders(
  headers?: HeadersInit,
  body?: BodyInit | null,
  accessToken?: string,
) {
  const nextHeaders = new Headers(headers ?? {});

  if (accessToken) {
    nextHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  if (body && !(body instanceof FormData) && !nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  return nextHeaders;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const sessionRef = useRef<AuthSession | null>(null);
  const refreshPromiseRef = useRef<Promise<AuthSession | null> | null>(null);

  const persistSession = useCallback((nextSession: AuthSession | null) => {
    sessionRef.current = nextSession;
    setSession(nextSession);

    if (nextSession) {
      writeStoredAuthSession(nextSession);
      return;
    }

    clearStoredAuthSession();
  }, []);

  const refreshSession = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return (await refreshPromiseRef.current) !== null;
    }

    const currentSession = sessionRef.current;
    if (!currentSession?.tokens.refresh) {
      persistSession(null);
      return false;
    }

    const refreshPromise = (async () => {
      const response = await fetch(getApiUrl("/auth/refresh/"), {
        method: "POST",
        headers: createJsonHeaders(undefined, "refresh"),
        body: JSON.stringify({ refresh: currentSession.tokens.refresh }),
      });

      if (!response.ok) {
        persistSession(null);
        return null;
      }

      const payload = (await response.json()) as AuthPayload;
      const nextSession = toAuthSession(payload);
      persistSession(nextSession);
      return nextSession;
    })();

    refreshPromiseRef.current = refreshPromise;

    try {
      return (await refreshPromise) !== null;
    } finally {
      refreshPromiseRef.current = null;
    }
  }, [persistSession]);

  useEffect(() => {
    const storedSession = readStoredAuthSession();

    if (!storedSession) {
      setIsReady(true);
      return;
    }

    persistSession(storedSession);
    setIsReady(true);

    void (async () => {
      const response = await fetch(getApiUrl("/auth/me/"), {
        headers: createJsonHeaders(
          undefined,
          undefined,
          storedSession.tokens.access,
        ),
        cache: "no-store",
      });

      if (response.ok) {
        const payload = (await response.json()) as AuthPayload;
        persistSession(mergeAuthPayload(storedSession, payload));
        return;
      }

      await refreshSession();
    })();
  }, [persistSession, refreshSession]);

  const submitAuthRequest = useCallback(
    async (
      path: string,
      body: Record<string, string>,
      fallbackMessage: string,
    ) => {
      const response = await fetch(getApiUrl(path), {
        method: "POST",
        headers: createJsonHeaders(undefined, "body"),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response, fallbackMessage));
      }

      const payload = (await response.json()) as AuthPayload;
      persistSession(toAuthSession(payload));
    },
    [persistSession],
  );

  const login = useCallback(
    async (input: { login: string; password: string }) => {
      await submitAuthRequest(
        "/auth/login/",
        input,
        "Unable to sign in right now.",
      );
    },
    [submitAuthRequest],
  );

  const register = useCallback(
    async (input: { username: string; email: string; password: string }) => {
      await submitAuthRequest(
        "/auth/register/",
        input,
        "Unable to create your account right now.",
      );
    },
    [submitAuthRequest],
  );

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const fetchWithAuth = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const currentSession = sessionRef.current;
      if (!currentSession?.tokens.access) {
        throw new Error("Please log in to continue.");
      }

      const sendRequest = async (accessToken: string) =>
        fetch(getApiUrl(path), {
          ...init,
          headers: createJsonHeaders(init.headers, init.body, accessToken),
        });

      let response = await sendRequest(currentSession.tokens.access);

      if (response.status === 401) {
        const didRefresh = await refreshSession();

        if (!didRefresh || !sessionRef.current?.tokens.access) {
          return response;
        }

        response = await sendRequest(sessionRef.current.tokens.access);
      }

      return response;
    },
    [refreshSession],
  );

  const value = useMemo(
    () => ({
      apiKey: session?.apiKey ?? null,
      fetchWithAuth,
      isAuthenticated: Boolean(session),
      isReady,
      login,
      logout,
      refreshSession,
      register,
      user: session?.user ?? null,
    }),
    [fetchWithAuth, isReady, login, logout, refreshSession, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
