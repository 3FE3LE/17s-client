import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProviders } from '@17suit/ui/app-providers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Six Sense Proof | 17Suit',
  description: 'Six Sense Proof product workspace on sixsense.17suit.com.',
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
