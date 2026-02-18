import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProviders } from '@17suit/ui/app-providers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'One Plan Trip | 17Suit',
  description: 'One Plan Trip product workspace on travel.17suit.com.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WebAuthProvider>
          <AppProviders>{children}</AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
