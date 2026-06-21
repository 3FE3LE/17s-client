import { ApiClient, getApiErrorDisplayMessage, normalizeApiBaseUrl } from '@17suit/core';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

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
  try {
    const client = new ApiClient({
      baseUrl: `${apiBaseUrl}/finance`,
      getAccessToken: () => token,
      timeoutMs: 8_000,
    });

    return await client.request<T>(path, {
      method: init.method,
      ...(init.body === undefined ? {} : { body: init.body }),
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    throw new Error(getApiErrorDisplayMessage(error));
  }
}
