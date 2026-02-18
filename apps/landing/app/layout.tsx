import type { Metadata } from 'next';
import { AppProviders } from '@17suit/ui/app-providers';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '17Suit',
  description: 'Operating system for category-leading products',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
