import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProviders } from '@17suit/ui/app-providers';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fifteen All Check | 17Suit',
  description: 'Fifteen All Check product workspace on cash-pulse.17suit.com.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <WebAuthProvider>
          <AppProviders>
            <NuqsAdapter>{children}</NuqsAdapter>
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
