import type { Metadata } from 'next';
import { WebAuthProvider } from '@17suit/core/auth/next';
import { ThemeScript } from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import { Amaranth, Arvo, Zilla_Slab } from 'next/font/google';
import type { ReactNode } from 'react';
import { SiteFooter } from './components/site-footer';
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
  title: '17Suit | Una cuenta para todas tus apps',
  description:
    'Revisa tus gastos, reserva cancha y, pronto, planea viajes, ordena tu clóset y agenda tu corte con una sola cuenta 17Suit.',
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
    <html
      lang="es"
      className={`${amaranth.variable} ${arvo.variable} ${zillaSlab.variable}`}
      // ThemeScript sets the `dark` class before hydration.
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <WebAuthProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInForceRedirectUrl="/"
          signUpForceRedirectUrl="/apps"
        >
          <AppProviders>
            {children}
            <SiteFooter />
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
