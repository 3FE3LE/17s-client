import type { Metadata } from 'next';
import { AppProviders } from '@17suit/ui/app-providers';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '17Suit Admin Platform',
  description:
    'Internal SaaS control plane for tenants, billing, feature flags, and product analytics.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
