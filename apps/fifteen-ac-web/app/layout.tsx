import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProviders } from '@17suit/ui/app-providers';
import type { Metadata } from 'next';
import { Amaranth, Arvo, Zilla_Slab } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
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
  title: 'Fifteen All Check | 17Suit',
  description: 'Fifteen All Check product workspace on cash-pulse.17suit.com.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${amaranth.variable} ${arvo.variable} ${zillaSlab.variable}`}>
      <body>
        <WebAuthProvider>
          <AppProviders>
            <NuqsAdapter>{children}</NuqsAdapter>
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
