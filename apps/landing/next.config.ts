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
};

export default nextConfig;
