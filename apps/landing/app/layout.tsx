import type { Metadata } from 'next';
import { WebAuthProvider } from '@17suit/core/auth/next';
import {
  AppProductFooter,
  appProductFooterButtonStyle,
  appProductFooterTextLinkStyle,
} from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import { SignOutButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);
  const productLinks = [
    { label: 'Seven Reservations Club', href: '/seven-reservations-club' },
    { label: 'Six Sense Proof', href: '/six-sense-proof' },
    { label: 'Five Barber Go', href: '/five-barber-go' },
    { label: 'Nine To Nine Nurse', href: '/nine-to-nine-nurse' },
    { label: 'Two Split Bill', href: '/two-split-bill' },
    { label: 'One Plan Trip', href: '/one-plan-trip' },
    { label: 'Four You Closet', href: '/four-you-closet' },
    { label: 'Eight Dream Dishes', href: '/eight-dream-dishes' },
    { label: 'Fifteen All Check', href: '/fifteen-all-check' },
  ];

  return (
    <html lang="es">
      <body>
        <WebAuthProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInForceRedirectUrl="/"
          signUpForceRedirectUrl="/"
        >
          <AppProviders>
            {children}
            <AppProductFooter
              productName="17Suit"
              productTagline="Suite de apps y herramientas conectadas."
              suiteName="17Suit"
              actionControls={
                <>
                  <Link
                    href="/"
                    style={{
                      ...appProductFooterButtonStyle,
                      color: 'var(--color-brand-dark, #00171f)',
                    }}
                  >
                    Ir al inicio
                  </Link>
                  {isSignedIn ? (
                    <SignOutButton redirectUrl="/sign-in">
                      <button type="button" style={appProductFooterButtonStyle}>
                        Cerrar sesion
                      </button>
                    </SignOutButton>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        style={{
                          ...appProductFooterButtonStyle,
                          color: 'var(--color-brand-dark, #00171f)',
                        }}
                      >
                        Iniciar sesion
                      </Link>
                      <Link
                        href="/sign-up"
                        style={{
                          ...appProductFooterButtonStyle,
                          color: '#ffffff',
                          border: '1px solid #01695b',
                          background: 'linear-gradient(95deg, #00916e, #007666)',
                          boxShadow: '0 10px 22px rgba(0, 145, 110, 0.24)',
                        }}
                      >
                        Crear cuenta
                      </Link>
                    </>
                  )}
                </>
              }
              productLinkControls={productLinks.map((link) => (
                <Link key={link.href} href={link.href} style={appProductFooterTextLinkStyle}>
                  {link.label}
                </Link>
              ))}
            />
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
