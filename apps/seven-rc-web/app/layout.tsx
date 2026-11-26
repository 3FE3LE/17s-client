import { getProductLocale } from '@17suit/i18n/next';
import { WebAuthProvider } from '@17suit/core/auth/next';
import { AppProductFooter, buttonRecipe, ThemeScript } from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import { getServerAuth } from '@/lib/server-auth';
import type { Metadata } from 'next';
import { Amaranth, Arvo, Zilla_Slab } from 'next/font/google';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { RoleSwitch } from '@/components/role-switch';
import { SevenRcClientProviders } from '@/components/seven-rc-client-providers';
import { SignOutControl } from '@/components/sign-out-control';
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
  title: 'Seven Reservations Club | 17Suit',
  description:
    'Reserva canchas eligiendo un horario libre y recibe la confirmación del complejo, sin cadenas de WhatsApp.',
  icons: {
    icon: [
      { url: '/icon-17suit.ico', type: 'image/x-icon' },
      { url: '/icon-17suit.png', type: 'image/png', sizes: '200x200' },
    ],
    shortcut: '/icon-17suit.ico',
    apple: '/icon-17suit.png',
  },
};

const footerButton = (intent: 'primary' | 'secondary') =>
  buttonRecipe({ intent, size: 'sm', platform: 'web', fullWidth: false });

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getProductLocale();
  const { userId } = await getServerAuth();
  const isSignedIn = Boolean(userId);

  return (
    <html
      lang={locale}
      className={`${amaranth.variable} ${arvo.variable} ${zillaSlab.variable}`}
      // ThemeScript sets the `dark` class before hydration.
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <WebAuthProvider>
          <AppProviders locale={locale}>
            <SevenRcClientProviders>
              {isSignedIn ? (
                <header className="bg-background px-lg pt-sm">
                  <div className="mx-auto flex w-full max-w-[var(--container-content)] flex-wrap justify-end gap-sm">
                    <RoleSwitch />
                    <SignOutControl className={footerButton('secondary')} />
                  </div>
                </header>
              ) : null}
              {children}
              <AppProductFooter
                productName="Seven Reservations Club"
                productSlug="seven-reservations-club"
                productTagline="Reservas de canchas y agenda para complejos deportivos."
                suiteName="17Suit"
                actionControls={
                  isSignedIn ? (
                    <>
                      <Link href="/" className={footerButton('secondary')}>
                        Ir a mi panel
                      </Link>
                      <SignOutControl className={footerButton('secondary')} />
                    </>
                  ) : (
                    <>
                      <Link href="/sign-in?redirect_url=/" className={footerButton('secondary')}>
                        Iniciar sesión
                      </Link>
                      <Link href="/sign-up?redirect_url=/" className={footerButton('primary')}>
                        Crear cuenta
                      </Link>
                    </>
                  )
                }
              />
            </SevenRcClientProviders>
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
