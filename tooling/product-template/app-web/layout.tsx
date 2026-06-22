import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProductFooter } from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '__TITLE__ | 17Suit',
  description: '__TITLE__ product workspace.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <WebAuthProvider>
          <AppProviders>
            {children}
            <AppProductFooter
              productName="__TITLE__"
              productSlug="__SLUG__"
              productTagline="__TAGLINE__"
              suiteName="17Suit"
              homeHref="/"
              signInHref="/sign-in?redirect_url=/"
              signUpHref="/sign-up?redirect_url=/"
              productLinks={[{ label: 'Dashboard', href: '/' }]}
            />
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
