'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';

/**
 * Session token for calls to this app's API routes. It must be the real JWT:
 * Clerk's middleware treats any `Authorization` header as the session, so a
 * placeholder signs the request out (404). Sending it also keeps `fetch` calls
 * working while the session cookie is stale, since only document requests can
 * go through Clerk's cookie handshake.
 */
export function useAccessToken(): () => Promise<string | null> {
  const { getToken } = useAuth();
  return useCallback(() => getToken(), [getToken]);
}
