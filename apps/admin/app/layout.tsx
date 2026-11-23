import { WebAuthProvider } from '@17suit/core/auth/next';
import type { Metadata } from 'next';
import { Arvo, Zilla_Slab } from 'next/font/google';
import type { ReactNode } from 'react';
import { ThemeScript } from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import './globals.css';

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
  title: {
    default: 'Consola de operación · 17Suit',
    template: '%s · Consola 17Suit',
  },
  description:
    'Consola interna de operación de 17Suit para tenants, facturación, feature flags y analítica de producto.',
  robots: { index: false, follow: false },
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
        <WebAuthProvider>
          <AppProviders themeMode="light">{children}</AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
