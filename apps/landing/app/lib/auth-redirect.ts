/**
 * Resolves a safe post-auth redirect target from a `redirect_url` param.
 *
 * Rules:
 * - Relative paths starting with a single `/` are always allowed.
 * - Absolute URLs are allowed only if their origin is in the allow-list
 *   (env: NEXT_PUBLIC_FIFTEEN_AC_WEB_URL, NEXT_PUBLIC_SEVEN_RC_WEB_URL,
 *    NEXT_PUBLIC_NINE_CC_WEB_URL, NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS)
 *   OR, in development, if they point to localhost/127.0.0.1 (so cross-port
 *   product apps work without env setup).
 * - Anything else falls back to `/`.
 */
export function resolveRedirectTarget(rawValue: string | string[] | null | undefined): string {
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  if (!value || value.trim().length === 0) {
    return '/';
  }
  if (value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_FIFTEEN_AC_WEB_URL,
    process.env.NEXT_PUBLIC_SEVEN_RC_WEB_URL,
    process.env.NEXT_PUBLIC_NINE_CC_WEB_URL,
    process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS,
  ]
    .flatMap((entry) => entry?.split(',') ?? [])
    .map((entry) => entry.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  try {
    const url = new URL(value);
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const allowLocalhostInDev = process.env.NODE_ENV !== 'production' && isLocalhost;
    if (allowedOrigins.includes(url.origin) || allowLocalhostInDev) {
      return url.toString();
    }
  } catch {
    return '/';
  }

  return '/';
}
