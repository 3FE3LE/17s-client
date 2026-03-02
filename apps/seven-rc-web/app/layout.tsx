import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProductFooter } from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SevenRcClientProviders } from '@/components/seven-rc-client-providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seven Reservations Club | 17Suit',
  description: 'Seven Reservations Club product workspace on 7rc.17suit.com.',
  icons: {
    icon: [
      { url: '/icon-17suit.ico', type: 'image/x-icon' },
      { url: '/icon-17suit.png', type: 'image/png', sizes: '200x200' },
    ],
    shortcut: '/icon-17suit.ico',
    apple: '/icon-17suit.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <WebAuthProvider>
          <AppProviders>
            <SevenRcClientProviders>
              {children}
              <AppProductFooter
                productName="Seven Reservations Club"
                productSlug="seven-reservations-club"
                productTagline="Reservas y operacion para complejos deportivos."
                suiteName="17Suit"
                homeHref="/"
                signInHref="/sign-in?redirect_url=/"
                signUpHref="/sign-up?redirect_url=/"
                productLinks={[
                  { label: 'Vista owner', href: '/owner' },
                  { label: 'Vista player', href: '/play' },
                  { label: 'Onboarding de rol', href: '/onboarding/role' },
                ]}
              />
            </SevenRcClientProviders>
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
