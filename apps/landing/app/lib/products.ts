import { siteOrigin, type SiteEnv, type SiteKey } from '@17suit/core/site-origins';

/**
 * Single source of truth for the landing product catalog.
 *
 * Structural data only (slug, accent, status, app URL). All user-facing copy
 * lives in the `landing` catalog (`app/i18n`, key `products.<accentKey>`).
 * Consumed by the home page, the per-product page and the footer.
 *
 * The official portfolio (owner decision, 2026-11-21) is Fifteen Account Check,
 * Seven Reservations Club, One Plan Trip, For Your Closet and Five Barber Go.
 *
 * Accent colors live in `app/globals.css` under `[data-product]` so light and
 * dark mode each get a value that clears 4.5:1 on every landing surface.
 */

export type ProductStatus = 'live' | 'beta' | 'soon';

export interface Product {
  slug: string;
  /** Key used by `[data-product]` in globals.css for the accent color. */
  accentKey: 'fifteen' | 'seven' | 'one' | 'closet' | 'five';
  numeral: string;
  name: string;
  /** Short name for CTAs ("Try Fifteen"). */
  shortName: string;
  status: ProductStatus;
  /**
   * Shows the "Your data" block under the steps. It links to this /privacy
   * anchor only once `LEGAL_PUBLISHED` (app/lib/legal.ts) is true.
   */
  privacyAnchor?: string;
  /** Key in `SITE_ORIGINS` (`@17suit/core/site-origins`); only for products with an app. */
  siteKey?: SiteKey;
}

export const products: readonly Product[] = [
  {
    slug: 'fifteen-account-check',
    accentKey: 'fifteen',
    numeral: '15',
    name: 'Fifteen Account Check',
    shortName: 'Fifteen',
    status: 'live',
    privacyAnchor: 'gmail-access',
    siteKey: 'fifteen-ac',
  },
  {
    slug: 'seven-reservations-club',
    accentKey: 'seven',
    numeral: '7',
    name: 'Seven Reservations Club',
    shortName: 'Seven',
    status: 'beta',
    siteKey: 'seven-rc',
  },
  {
    slug: 'one-plan-trip',
    accentKey: 'one',
    numeral: '1',
    name: 'One Plan Trip',
    shortName: 'One',
    status: 'soon',
  },
  {
    slug: 'for-your-closet',
    accentKey: 'closet',
    numeral: '4',
    name: 'For Your Closet',
    shortName: 'For Your Closet',
    status: 'soon',
  },
  {
    slug: 'five-barber-go',
    accentKey: 'five',
    numeral: '5',
    name: 'Five Barber Go',
    shortName: 'Five Barber Go',
    status: 'soon',
  },
];

export const productCount = products.length;

/** Old landing slugs that map to a current product slug. */
export const legacySlugRedirects: Record<string, string> = {
  'fifteen-all-check': 'fifteen-account-check',
  'four-you-closet': 'for-your-closet',
};

/**
 * Product whose web app origin matches an already-validated redirect target.
 * Used by /sign-up to say which app the new account is for. Relative targets
 * (landing pages) return undefined.
 */
export function getProductForRedirect(target: string): Product | undefined {
  if (!/^https?:\/\//i.test(target)) return undefined;
  let origin: string;
  try {
    origin = new URL(target).origin;
  } catch {
    return undefined;
  }
  return products.find((product) => {
    const appUrl = getProductAppUrl(product);
    if (!appUrl) return false;
    try {
      return new URL(appUrl).origin === origin;
    } catch {
      return false;
    }
  });
}

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function hasApp(product: Product): boolean {
  return product.status !== 'soon';
}

/**
 * Resolves the product web app URL from the central origin catalog: the
 * canonical `https://<host>/` in production, localhost elsewhere. No
 * per-project env var, so a link can never point to a `*.vercel.app` host.
 */
export function getProductAppUrl(product: Product): string | null {
  if (!hasApp(product) || !product.siteKey) return null;
  return `${siteOrigin(product.siteKey, siteEnv())}/`;
}

// NEXT_PUBLIC_* values must be referenced literally to be inlined at build time.
function siteEnv(): SiteEnv {
  return {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_SITE_ORIGIN_FIFTEEN_AC: process.env.NEXT_PUBLIC_SITE_ORIGIN_FIFTEEN_AC,
    NEXT_PUBLIC_SITE_ORIGIN_SEVEN_RC: process.env.NEXT_PUBLIC_SITE_ORIGIN_SEVEN_RC,
  };
}
