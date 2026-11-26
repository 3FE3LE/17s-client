'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';
import { E2E_SESSION_COOKIE, isFakeAuthEnabledInBrowser, parseFakeSession } from './fake-auth';

export const NO_ACTIVE_SESSION = 'No active session';

type GetToken = (options?: { skipCache?: boolean }) => Promise<string | null>;

/**
 * Reads a token, retrying once without Clerk's cache, and throws a specific
 * error when the browser has no active session. Calls made while Clerk is
 * still loading or after a stale cookie otherwise fail as a generic
 * "Unauthorized" that looks like an expired session.
 */
export async function requireAccessToken(getToken: GetToken): Promise<string> {
  const token = (await getToken()) ?? (await getToken({ skipCache: true }));
  if (!token) throw new Error(NO_ACTIVE_SESSION);
  return token;
}

/**
 * Session token for calls to this app's API routes. It must be the real JWT:
 * Clerk's middleware treats any `Authorization` header as the session, so a
 * placeholder signs the request out (404). Sending it also keeps `fetch` calls
 * working while the session cookie is stale, since only document requests can
 * go through Clerk's cookie handshake.
 */
export function useAccessToken(): () => Promise<string | null> {
  const { getToken } = useAuth();
  return useCallback(
    () => (isFakeAuthEnabledInBrowser() ? readFakeToken() : requireAccessToken(getToken)),
    [getToken],
  );
}

function readFakeToken(): Promise<string> {
  const raw = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${E2E_SESSION_COOKIE}=`))
    ?.slice(E2E_SESSION_COOKIE.length + 1);
  const token = parseFakeSession(raw);
  return token ? Promise.resolve(token) : Promise.reject(new Error(NO_ACTIVE_SESSION));
}
