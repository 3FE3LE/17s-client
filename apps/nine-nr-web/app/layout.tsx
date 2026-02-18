import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProviders } from '@17suit/ui/app-providers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Nine To Nine Nurse | 17Suit',
  description: 'Nine To Nine Nurse product workspace on nurse.17suit.com.',
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
