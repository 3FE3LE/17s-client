import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

function normalizeApiBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

export async function fetchFinanceJson<T>(path: string): Promise<T> {
  return requestFinanceJson<T>(path, { method: 'GET' });
}

export async function postFinanceJson<T>(path: string, body?: unknown): Promise<T> {
  return requestFinanceJson<T>(path, {
    method: 'POST',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

export async function patchFinanceJson<T>(path: string, body?: unknown): Promise<T> {
  return requestFinanceJson<T>(path, {
    method: 'PATCH',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

export async function deleteFinanceJson<T>(path: string): Promise<T> {
  return requestFinanceJson<T>(path, { method: 'DELETE' });
}

async function requestFinanceJson<T>(
  path: string,
  init: Pick<RequestInit, 'body'> & { method: string },
): Promise<T> {
  const { getToken } = await auth();
  const tokenTemplate = process.env.CLERK_JWT_TEMPLATE;
  const token = tokenTemplate ? await getToken({ template: tokenTemplate }) : await getToken();

  if (!token) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent('/')}`);
  }

  const apiBaseUrl = normalizeApiBaseUrl(process.env.API_BASE_URL ?? 'http://localhost:4000/api');
  const requestInit: RequestInit = {
    method: init.method,
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  };
  if (init.body) {
    requestInit.body = init.body;
  }

  const response = await fetch(`${apiBaseUrl}/finance${path}`, requestInit);

  if (!response.ok) {
    throw new Error(await getFinanceErrorMessage(response));
  }

  return (await response.json()) as T;
}

async function getFinanceErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as unknown;
    if (payload && typeof payload === 'object' && 'message' in payload) {
      const message = payload.message;
      if (Array.isArray(message)) return message.join(', ');
      if (typeof message === 'string') return message;
    }
  } catch {
    return `Finance request failed (${response.status})`;
  }

  return `Finance request failed (${response.status})`;
}
