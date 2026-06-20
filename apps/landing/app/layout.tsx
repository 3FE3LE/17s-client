import type { Metadata } from 'next';
import { AppProductFooter } from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '17Suit | Suite de apps',
  description: 'Suite de apps y herramientas para facilitar operaciones y flujos diarios.',
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
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
        >
          <AppProviders>
            {children}
            <AppProductFooter
              productName="17Suit"
              productTagline="Suite de apps y herramientas conectadas."
              suiteName="17Suit"
              homeHref="/"
              signInHref="/sign-in"
              signUpHref="/sign-up"
              productLinks={[
                { label: 'Seven Reservations Club', href: '/seven-reservations-club' },
                { label: 'Six Sense Proof', href: '/six-sense-proof' },
                { label: 'Five Barber Go', href: '/five-barber-go' },
                { label: 'Nine To Nine Nurse', href: '/nine-to-nine-nurse' },
                { label: 'Two Split Bill', href: '/two-split-bill' },
                { label: 'One Plan Trip', href: '/one-plan-trip' },
                { label: 'Four You Closet', href: '/four-you-closet' },
                { label: 'Eight Dream Dishes', href: '/eight-dream-dishes' },
                { label: 'Fourteen Cash Pulse', href: '/fourteen-cash-pulse' },
              ]}
            />
          </AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
