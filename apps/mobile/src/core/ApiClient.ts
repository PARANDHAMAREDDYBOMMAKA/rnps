import type { ApiError } from "@rnp/shared";

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

export class ApiClient {
  private token: string | null = null;
  private onUnauthorized: (() => void) | null = null;

  constructor(private readonly baseUrl: string) {}

  setToken(token: string | null): void {
    this.token = token;
  }

  setUnauthorizedHandler(handler: (() => void) | null): void {
    this.onUnauthorized = handler;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  private async request<T>(method: Method, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiRequestError(0, "Cannot reach the server. Check your connection.");
    }

    if (res.status === 401 && this.token) this.onUnauthorized?.();
    const text = await res.text();
    const data = text ? (JSON.parse(text) as T | ApiError) : null;
    if (!res.ok) {
      const err = data as ApiError | null;
      throw new ApiRequestError(res.status, err?.error ?? res.statusText, err?.details);
    }
    return data as T;
  }
}
