export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const customInstance = async <T>(
  config: { url: string; method: string; params?: Record<string, unknown>; data?: unknown; headers?: Record<string, string> },
  _options?: unknown,
): Promise<T> => {
  const token = localStorage.getItem("saPlugAdminToken");
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

  const url = new URL(config.url, window.location.origin);
  if (config.params) {
    Object.entries(config.params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }

  const res = await fetch(url.toString(), {
    method: config.method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(config.headers ?? {}),
    },
    body: config.data !== undefined ? JSON.stringify(config.data) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("saPlugAdminToken");
    if (!window.location.pathname.endsWith("/login")) {
      window.location.href = `${base}/login`;
    }
    throw new ApiError(401, "Unauthorized");
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.error ?? body?.message ?? message;
    } catch {
      try { message = await res.text(); } catch {}
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") return undefined as T;
  return res.json() as Promise<T>;
};
