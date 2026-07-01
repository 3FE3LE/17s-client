import { WebAuthProvider } from '@17suit/core/auth/next';
import {
  AppProductFooter,
  appProductFooterButtonStyle,
  appProductFooterTextLinkStyle,
} from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import { SignOutButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { Amaranth, Arvo, Zilla_Slab } from 'next/font/google';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { SevenRcClientProviders } from '@/components/nine-cc-client-providers';
import './globals.css';

const amaranth = Amaranth({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-amaranth',
  display: 'swap',
});

const arvo = Arvo({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-arvo',
  display: 'swap',
});

const zillaSlab = Zilla_Slab({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-zilla',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nine Care Companion | 17Suit',
  description: 'Nine Care Companion product workspace on 7rc.17suit.com.',
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
    { label: 'Vista owner', href: '/owner' },
    { label: 'Vista player', href: '/play' },
    { label: 'Onboarding de rol', href: '/onboarding/role' },
  ];

  return (
    <html lang="es" className={`${amaranth.variable} ${arvo.variable} ${zillaSlab.variable}`}>
      <body>
        <WebAuthProvider>
          <AppProviders>
            <SevenRcClientProviders>
              {children}
              <AppProductFooter
                productName="Nine Care Companion"
                productSlug="nine-care-companion"
                productTagline="Reservas y operacion para complejos deportivos."
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
                      <SignOutButton redirectUrl="/sign-in?redirect_url=/">
                        <button type="button" style={appProductFooterButtonStyle}>
                          Cerrar sesion
                        </button>
                      </SignOutButton>
                    ) : (
                      <>
                        <Link
                          href="/sign-in?redirect_url=/"
                          style={{
                            ...appProductFooterButtonStyle,
                            color: 'var(--color-brand-dark, #00171f)',
                          }}
                        >
                          Iniciar sesion
                        </Link>
                        <Link
                          href="/sign-up?redirect_url=/"
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
            </SevenRcClientProviders>
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
