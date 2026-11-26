/**
 * E2E-only auth seam (workspace#95, layer 2). With `E2E_FAKE_AUTH=1` the app trusts an
 * `e2e_session=test:<clerkUserId>` cookie instead of Clerk, and sends it as the bearer token. The
 * real server accepts it only when it runs its fake verifier (`test:` tokens).
 *
 * Hard guard: never active in a production build or on Vercel production, whatever the env says.
 */
export const E2E_SESSION_COOKIE = 'e2e_session';
const FAKE_PREFIX = 'test:';

export function isFakeAuthEnabled(): boolean {
  return (
    process.env.E2E_FAKE_AUTH === '1' &&
    process.env.NODE_ENV !== 'production' &&
    process.env.VERCEL_ENV !== 'production'
  );
}

/** Client-side flag: inlined at build time, dead code in production builds. */
export function isFakeAuthEnabledInBrowser(): boolean {
  return process.env.NEXT_PUBLIC_E2E_FAKE_AUTH === '1' && process.env.NODE_ENV !== 'production';
}

/** Returns the `test:<id>` token from a raw cookie value, or null when malformed. */
export function parseFakeSession(value: string | undefined | null): string | null {
  if (!value) return null;
  const decoded = decodeURIComponent(value);
  return decoded.startsWith(FAKE_PREFIX) && decoded.length > FAKE_PREFIX.length ? decoded : null;
}

export function fakeUserId(token: string): string {
  return token.slice(FAKE_PREFIX.length);
}
