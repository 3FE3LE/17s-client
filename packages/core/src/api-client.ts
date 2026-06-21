export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  timeoutMs?: number;
}

export type ApiErrorCode = 'HTTP_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT' | 'PARSE_ERROR';

export interface ApiErrorOptions {
  message: string;
  code: ApiErrorCode;
  status?: number;
  path?: string;
  payload?: unknown;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly path?: string;
  readonly payload?: unknown;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.name = 'ApiError';
    this.code = options.code;

    if (options.status !== undefined) {
      this.status = options.status;
    }
    if (options.path !== undefined) {
      this.path = options.path;
    }
    if (options.payload !== undefined) {
      this.payload = options.payload;
    }
    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function normalizeApiBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

export function getApiErrorDisplayMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return 'Unable to reach the API server. Check that the backend and database are running.';
  }

  if (!isApiError(error)) {
    return error instanceof Error ? error.message : 'Unexpected request error.';
  }

  if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
    return 'Unable to reach the API server. Check that the backend and database are running.';
  }

  return error.message;
}

export class ApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  async request<TResponse>(path: string, init: RequestInit = {}): Promise<TResponse> {
    const token = await this.options.getAccessToken?.();
    const headers = new Headers(init.headers);

    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetchWithTimeout(
      `${normalizeApiBaseUrl(this.options.baseUrl)}${path}`,
      {
        ...init,
        headers,
      },
      this.options.timeoutMs,
      path,
    );

    if (!response.ok) {
      const payload = await parseResponsePayload(response);
      throw new ApiError({
        message: extractErrorMessage(payload, `Request failed (${response.status}) for ${path}`),
        code: 'HTTP_ERROR',
        status: response.status,
        path,
        payload,
      });
    }

    return (await parseJsonResponse(response, path)) as TResponse;
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 8_000,
  path?: string,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: init.signal ?? controller.signal,
    });
  } catch (error) {
    const isTimeout =
      error instanceof DOMException
        ? error.name === 'AbortError'
        : error instanceof Error && error.name === 'AbortError';

    throw new ApiError({
      message: isTimeout ? 'Request timed out.' : 'Unable to reach API server.',
      code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
      cause: error,
      ...(path === undefined ? {} : { path }),
    });
  } finally {
    clearTimeout(timer);
  }
}

async function parseJsonResponse(response: Response, path: string): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError({
      message: `Invalid JSON response for ${path}`,
      code: 'PARSE_ERROR',
      status: response.status,
      path,
      cause: error,
    });
  }
}

async function parseResponsePayload(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    try {
      return await response.text();
    } catch {
      return null;
    }
  }
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string' && message.length > 0) return message;
  }

  if (payload && typeof payload === 'object' && 'error' in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === 'string' && error.length > 0) return error;
  }

  if (typeof payload === 'string' && payload.length > 0) {
    return payload;
  }

  return fallback;
}
