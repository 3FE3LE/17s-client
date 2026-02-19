import { loadEnv } from '@17suit/core';
import type { AppRole } from './role';

function normalizeApiBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, '');
  return trimmed.replace(/\/api$/, '');
}

export async function fetchPlatformMe(accessToken: string): Promise<unknown> {
  const apiBaseUrl = normalizeApiBaseUrl(loadEnv().API_BASE_URL);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  };
  const primaryResponse = await fetch(`${apiBaseUrl}/api/platform/me`, {
    headers: {
      ...headers,
    },
    cache: 'no-store',
  });
  const response =
    primaryResponse.status === 404
      ? await fetch(`${apiBaseUrl}/me`, {
          headers: {
            ...headers,
          },
          cache: 'no-store',
        })
      : primaryResponse;

  if (!response.ok) {
    throw new Error(`Failed to fetch /me (${response.status})`);
  }

  return (await response.json()) as unknown;
}

export async function persistOnboardingRole(accessToken: string, role: AppRole): Promise<void> {
  const apiBaseUrl = normalizeApiBaseUrl(loadEnv().API_BASE_URL);

  const response = await fetch(`${apiBaseUrl}/api/platform/onboarding/role`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ role }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Failed to persist role (${response.status})`);
  }
}
