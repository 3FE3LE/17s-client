import type { Metadata } from 'next';
import Link from 'next/link';
import { ReviewNotice } from '../components/legal-page';
import { SiteHeader, primaryButtonClass } from '../components/landing-ui';

export const metadata: Metadata = {
  title: 'Contacto | 17Suit',
  description: 'Escríbenos si tienes dudas sobre tu cuenta 17Suit o alguna de sus apps.',
};

/*
 * The address comes only from NEXT_PUBLIC_CONTACT_EMAIL (see .env.local.example).
 * Never hard-code an email here. Unset or malformed = no mailto link.
 */
function getContactEmail(): string | null {
  const value = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return null;
  }
  return value;
}

export default function ContactPage() {
  const email = getContactEmail();

  return (
    <main className="min-h-screen bg-suit-canvas text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <SiteHeader />

        <section
          aria-labelledby="contact-title"
          className="grid max-w-[60ch] gap-[var(--spacing-md)]"
        >
          <h1
            id="contact-title"
            className="m-0 text-balance font-arvo text-[clamp(34px,5vw,56px)] font-bold leading-[1.06] tracking-[-0.025em] text-text"
          >
            Contacto
          </h1>
          <p className="m-0 text-[clamp(16px,1.4vw,18px)] leading-[1.5] text-muted">
            Escríbenos si tienes dudas sobre tu cuenta 17Suit, el acceso a alguna app o tus datos.
          </p>

          {email ? (
            <div className="mt-[var(--spacing-sm)] grid gap-[var(--spacing-xs)]">
              <p className="m-0 text-sm leading-[18px] text-muted">Correo de contacto</p>
              <a
                href={`mailto:${email}`}
                className={`${primaryButtonClass} w-fit max-w-full break-all`}
              >
                {email}
              </a>
            </div>
          ) : (
            <ReviewNotice>Canal de contacto en configuración.</ReviewNotice>
          )}

          <p className="m-0 mt-[var(--spacing-md)] text-md leading-[1.5] text-muted">
            También puedes revisar la{' '}
            <Link href="/privacidad" className="font-bold text-text underline underline-offset-4">
              Política de privacidad
            </Link>{' '}
            y los{' '}
            <Link href="/terminos" className="font-bold text-text underline underline-offset-4">
              Términos
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
