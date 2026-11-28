import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // E2E builds into its own dir so it can run next to a developer's `next dev` on the same app.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  transpilePackages: ['@17suit/ui', '@17suit/core', '@17suit/module-seven-reservations-club'],
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
    },
  },
};

export default nextConfig;
