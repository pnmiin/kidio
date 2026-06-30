const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data?: T;
  errors?: string[] | null;
};

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, auth = true }: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok) {
    throw new Error(payload?.message || `API error: ${response.status}`);
  }

  if (!payload) {
    throw new Error("Empty API response");
  }

  return payload;
}
