import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProductFooter } from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fifteen All Check | 17Suit',
  description: 'Fifteen All Check product workspace on cash-pulse.17suit.com.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <WebAuthProvider>
          <AppProviders>
            {children}
            <AppProductFooter
              productName="Fifteen All Check"
              productSlug="fifteen-all-check"
              productTagline="Cockpit financiero personal con evidencia y revision."
              suiteName="17Suit"
              homeHref="/"
              signInHref="/sign-in?redirect_url=/"
              signUpHref="/sign-up?redirect_url=/"
              productLinks={[
                { label: 'Dashboard', href: '/' },
                { label: 'Transacciones', href: '/transactions' },
                { label: 'Revision', href: '/review' },
                { label: 'Email sources', href: '/settings/email-sources' },
              ]}
            />
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
