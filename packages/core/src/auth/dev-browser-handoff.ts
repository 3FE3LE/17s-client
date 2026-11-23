const DEV_BROWSER_NAME = '__clerk_db_jwt';
const SUFFIXED_COOKIE = new RegExp(`^${DEV_BROWSER_NAME}_[A-Za-z0-9_-]+$`);

/*
 * Landing hands a Clerk development session to a product by putting its dev
 * browser token in the URL. Clerk's handshake can then write only the plain
 * `__clerk_db_jwt` cookie, while clerk-js prefers the suffixed one. A product
 * that was visited before sign-in still has an old suffixed cookie, so clerk-js
 * would talk to Clerk as that other browser and drop the session on hydration.
 *
 * Expiring the outdated cookie on the handshake redirect fixes it, with no extra
 * redirect. clerk-js writes the suffixed cookie again from the plain one.
 */

/** Names of the suffixed dev-browser cookies that disagree with the token in the URL. */
export function staleDevBrowserCookies(
  request: Pick<Request, 'url' | 'headers'>,
  publishableKey: string | undefined,
): string[] {
  if (!publishableKey?.startsWith('pk_test_')) return [];

  const handedOver = new URL(request.url).searchParams.get(DEV_BROWSER_NAME);
  if (!handedOver) return [];

  return (request.headers.get('cookie') ?? '').split(';').flatMap((pair) => {
    const separator = pair.indexOf('=');
    if (separator < 0) return [];
    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    return SUFFIXED_COOKIE.test(name) && value !== handedOver ? [name] : [];
  });
}

/** Expires those cookies, only on Clerk's own dev-browser handshake redirect. */
export function expireStaleDevBrowserCookies(
  request: Pick<Request, 'url' | 'headers'>,
  response: Response,
  publishableKey: string | undefined,
): void {
  if (!response.headers.get('location')?.includes('/v1/client/handshake')) return;

  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  for (const name of staleDevBrowserCookies(request, publishableKey)) {
    response.headers.append('set-cookie', `${name}=; Path=/; Max-Age=0${secure}`);
  }
}
