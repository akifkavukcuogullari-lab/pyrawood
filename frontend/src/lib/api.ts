import { API_BASE_URL } from '@/lib/api-contract';
import { getToken, removeToken } from '@/lib/auth';
import type { ApiResponse, PaginatedResponse } from '@/lib/types';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 — clear auth and redirect
  if (res.status === 401) {
    removeToken();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
    throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  // Handle non-JSON responses
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    if (!res.ok) {
      throw new ApiError('Request failed', res.status);
    }
    return {} as T;
  }

  const json = await res.json();

  if (!res.ok) {
    throw new ApiError(
      json.error?.message || 'Request failed',
      res.status,
      json.error?.code,
      json.error?.details
    );
  }

  return json as T;
}

// Convenience methods

export async function apiGet<T>(
  path: string,
  params?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const qs = buildQueryString(params);
  return request<ApiResponse<T>>(`${path}${qs}`);
}

export async function apiGetPaginated<T>(
  path: string,
  params?: Record<string, unknown>
): Promise<PaginatedResponse<T>> {
  const qs = buildQueryString(params);
  return request<PaginatedResponse<T>>(`${path}${qs}`);
}

export async function apiPost<T>(
  path: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T>(
  path: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(
  path: string
): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(path, {
    method: 'DELETE',
  });
}

// Re-export for convenience
export { ApiError };
