export const DEV_BROWSER_PARAM = '__clerk_db_jwt';

function isAbsolute(target: string): boolean {
  return !target.startsWith('/');
}

/**
 * Where the browser goes once authenticated. `target` must come from
 * `resolveRedirectTarget`.
 *
 * Targets on another origin go through `/continue` first: Clerk drops
 * cross-origin redirects after OAuth, and only the server adds what the
 * product needs to see the session (see `withDevSession`).
 */
export function afterAuthPath(target: string): string {
  return isAbsolute(target) ? `/continue?redirect_url=${encodeURIComponent(target)}` : target;
}

/**
 * A Clerk development instance keeps its browser token in a host-only cookie, so
 * another origin (subdomains included) only sees the session when the token
 * travels in the URL, as Clerk's `buildUrlWithAuth` does. Production instances
 * share the session through cookies and never get the parameter.
 *
 * `target` must come from `resolveRedirectTarget`: the token may only reach
 * allow-listed origins.
 */
export function withDevSession(
  target: string,
  publishableKey: string | undefined,
  devBrowserToken: string | undefined,
): string {
  if (!isAbsolute(target) || !publishableKey?.startsWith('pk_test_') || !devBrowserToken) {
    return target;
  }
  const url = new URL(target);
  url.searchParams.set(DEV_BROWSER_PARAM, devBrowserToken);
  return url.toString();
}
