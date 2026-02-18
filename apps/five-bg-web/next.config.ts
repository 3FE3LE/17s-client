import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: [
    '@17suit/ui',
    '@17suit/core',
    '@17suit/module-five-barber-go',
    'tamagui',
    '@tamagui/config',
    '@tamagui/core',
  ],
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
    },
  },
};

export default nextConfig;
