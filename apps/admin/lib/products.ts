// Snapshot of `/home/fl/17s-workspace/apps-registry.json` (workspace root).
// The registry lives outside `17s-client`, so the admin build (Vercel Root
// Directory = apps/admin) cannot read it. Keep this list in sync by hand when
// the registry changes: same app keys, subdomains, dev ports and `active` flags.

export type SuiteSurface = 'web' | 'mobile' | 'landing' | 'admin';

export interface SuiteApp {
  /** Registry key, e.g. `fifteen-ac-web`. */
  key: string;
  surface: SuiteSurface;
  devPort: number;
  active: boolean;
}

export interface SuiteProduct {
  /** Registry `product` slug. */
  slug: string;
  name: string;
  subdomain: string;
  apps: SuiteApp[];
}

export const suiteProducts: SuiteProduct[] = [
  {
    slug: 'landing',
    name: 'Sitio público 17Suit',
    subdomain: '17suit.com',
    apps: [{ key: 'landing', surface: 'landing', devPort: 3000, active: true }],
  },
  {
    slug: 'admin',
    name: 'Consola de operación',
    subdomain: 'admin.17suit.com',
    apps: [{ key: 'admin', surface: 'admin', devPort: 3018, active: true }],
  },
  {
    slug: 'fifteen-ac',
    name: 'Fifteen All Check',
    subdomain: 'fifteen-ac.17suit.com',
    apps: [
      { key: 'fifteen-ac-web', surface: 'web', devPort: 3015, active: true },
      { key: 'fifteen-ac-mobile', surface: 'mobile', devPort: 8083, active: true },
    ],
  },
  {
    slug: 'seven-rc',
    name: 'Seven Reservations Club',
    subdomain: 'seven-rc.17suit.com',
    apps: [
      { key: 'seven-rc-web', surface: 'web', devPort: 3007, active: true },
      { key: 'seven-rc-mobile', surface: 'mobile', devPort: 8087, active: true },
    ],
  },
  {
    slug: 'nine-cc',
    name: 'Nine Care Companion',
    subdomain: 'nine-cc.17suit.com',
    apps: [
      { key: 'nine-cc-web', surface: 'web', devPort: 3009, active: true },
      { key: 'nine-cc-mobile', surface: 'mobile', devPort: 8089, active: true },
    ],
  },
];

export const surfaceLabel: Record<SuiteSurface, string> = {
  web: 'Web',
  mobile: 'Móvil',
  landing: 'Sitio público',
  admin: 'Consola',
};
