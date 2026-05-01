const STORAGE_KEY = "automarketer_user";
const ACCESS_TOKEN_KEY = "automarketer_token";
const REFRESH_TOKEN_KEY = "automarketer_refresh";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

const baseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1").replace(/\/$/, "");

const onUnauthorized: Array<() => void> = [];
export const onAuthLogout = (cb: () => void) => {
  onUnauthorized.push(cb);
  return () => {
    const i = onUnauthorized.indexOf(cb);
    if (i >= 0) onUnauthorized.splice(i, 1);
  };
};

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};
const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

let refreshInFlight: Promise<string | null> | null = null;
const tryRefresh = async (): Promise<string | null> => {
  if (refreshInFlight) return refreshInFlight;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { accessToken: string; refreshToken: string };
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
};

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  skipAuth?: boolean;
  raw?: boolean;
}

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
  const url = new URL(`${baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
};

const doFetch = async <T>(path: string, opts: RequestOptions, retried = false): Promise<T> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (!opts.skipAuth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, opts.query), {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });

  if (res.status === 401 && !opts.skipAuth && !retried) {
    const refreshed = await tryRefresh();
    if (refreshed) return doFetch<T>(path, opts, true);
    clearAuth();
    onUnauthorized.forEach((cb) => cb());
    throw new ApiError(401, "Session expired", null);
  }

  if (opts.raw) return res as unknown as T;

  if (res.status === 204) return undefined as unknown as T;

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload
        ? Array.isArray((payload as { message: unknown }).message)
          ? ((payload as { message: string[] }).message as string[]).join(", ")
          : String((payload as { message: unknown }).message)
        : `Request failed (${res.status})`);
    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
};

export const apiClient = {
  get: <T>(path: string, query?: RequestOptions["query"], signal?: AbortSignal) =>
    doFetch<T>(path, { method: "GET", query, signal }),
  post: <T>(path: string, body?: unknown, opts: Partial<RequestOptions> = {}) =>
    doFetch<T>(path, { method: "POST", body, ...opts }),
  patch: <T>(path: string, body?: unknown) =>
    doFetch<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body?: unknown) =>
    doFetch<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => doFetch<T>(path, { method: "DELETE" }),
  raw: (path: string, query?: RequestOptions["query"]) =>
    doFetch<Response>(path, { method: "GET", query, raw: true }),
  baseUrl,
  setTokens,
  clearAuth,
  getAccessToken,
};

export const ACCESS_TOKEN_STORAGE_KEY = ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_STORAGE_KEY = REFRESH_TOKEN_KEY;
export const USER_STORAGE_KEY = STORAGE_KEY;
