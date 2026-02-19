import type {
  SevenReservationsClubMeRoleResponse,
  SevenReservationsClubPlatformUser,
  SevenReservationsClubRole,
} from '../onboarding-role';

export interface SevenReservationsClubRoleDataSource {
  getCurrentUserRole: () => Promise<SevenReservationsClubMeRoleResponse>;
  setCurrentUserRole: (
    role: SevenReservationsClubRole,
  ) => Promise<SevenReservationsClubPlatformUser>;
}

function buildApiUrl(baseUrl: string, path: string): string {
  const trimmedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedBase = trimmedBase.replace(/\/api$/, '');
  return `${normalizedBase}${path}`;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 8000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === 'string' && error.length > 0) {
      return error;
    }
  }
  return fallback;
}

export function createWebBffRoleDataSource(): SevenReservationsClubRoleDataSource {
  return {
    async getCurrentUserRole() {
      const response = await fetch('/api/me', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        const payload = await parseJsonSafe(response);
        throw new Error(
          extractErrorMessage(payload, `Failed to load /api/me (${response.status})`),
        );
      }

      return (await response.json()) as SevenReservationsClubMeRoleResponse;
    },

    async setCurrentUserRole(role) {
      const response = await fetch('/api/onboarding/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const payload = await parseJsonSafe(response);
        throw new Error(
          extractErrorMessage(payload, `No se pudo guardar el rol (${response.status})`),
        );
      }

      return (await response.json()) as SevenReservationsClubPlatformUser;
    },
  };
}

export function createExternalPlatformRoleDataSource(options: {
  apiBaseUrl: string;
  getAccessToken: () => Promise<string | null>;
}): SevenReservationsClubRoleDataSource {
  const { apiBaseUrl, getAccessToken } = options;

  return {
    async getCurrentUserRole() {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Unauthorized');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };
      const primaryResponse = await fetchWithTimeout(buildApiUrl(apiBaseUrl, '/api/platform/me'), {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      const response =
        primaryResponse.status === 404
          ? await fetchWithTimeout(buildApiUrl(apiBaseUrl, '/me'), {
              method: 'GET',
              headers,
              cache: 'no-store',
            })
          : primaryResponse;

      if (!response.ok) {
        const payload = await parseJsonSafe(response);
        throw new Error(
          extractErrorMessage(payload, `Failed to fetch platform user (${response.status})`),
        );
      }

      const payload = (await response.json()) as {
        role?: SevenReservationsClubRole | null;
      };

      return {
        role: payload.role ?? null,
        source: payload.role ? 'backend' : 'none',
      };
    },

    async setCurrentUserRole(role) {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Unauthorized');
      }

      const response = await fetchWithTimeout(
        buildApiUrl(apiBaseUrl, '/api/platform/onboarding/role'),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ role }),
        },
      );

      if (!response.ok) {
        const payload = await parseJsonSafe(response);
        throw new Error(
          extractErrorMessage(payload, `No se pudo guardar el rol (${response.status})`),
        );
      }

      return (await response.json()) as SevenReservationsClubPlatformUser;
    },
  };
}
