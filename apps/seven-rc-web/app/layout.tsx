import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProviders } from '@17suit/ui/app-providers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SevenRcClientProviders } from '@/components/seven-rc-client-providers';

export const metadata: Metadata = {
  title: 'Seven Reservations Club | 17Suit',
  description: 'Seven Reservations Club product workspace on 7rc.17suit.com.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WebAuthProvider>
          <AppProviders>
            <SevenRcClientProviders>{children}</SevenRcClientProviders>
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
