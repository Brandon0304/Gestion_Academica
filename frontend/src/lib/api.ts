export interface ApiError {
  code: string
  message: string
  details?: { field: string; message: string }[]
}

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    public error: ApiError
  ) {
    super(error.message)
    this.name = "ApiRequestError"
  }
}

const BASE = "/api/v1"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token)
}

export function clearToken() {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("auth_user")
}

export function setUser(user: unknown) {
  localStorage.setItem("auth_user", JSON.stringify(user))
}

export function getUser(): unknown {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("auth_user")
  return raw ? JSON.parse(raw) : null
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(`${BASE}${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v))
    })
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  const token = getToken()
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => ({
      error: { code: "UNKNOWN", message: res.statusText },
    }))) as { error: ApiError }
    throw new ApiRequestError(res.status, err.error)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    request<T>("GET", path, undefined, params),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
}
