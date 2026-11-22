import type { NextConfig } from 'next';
import { legacySlugRedirects } from './app/lib/products';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Old product slugs keep working: they 308 to the current slug.
  redirects() {
    return Promise.resolve(
      Object.entries(legacySlugRedirects).map(([from, to]) => ({
        source: `/${from}`,
        destination: `/${to}`,
        permanent: true,
      })),
    );
  },
  transpilePackages: ['@17suit/ui'],
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
    },
  },
  // Documented runtime env inputs (consumed by `sentry.*.config.ts` /
  // `instrumentation.ts`). Surfaced here so contributors find them in one place.
  // Validated at app boot by the Sentry init guard — values are optional.
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
    SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
  },
};

export default nextConfig;
