'use client';

import { AppButton } from '@17suit/ui';
import { useClerk } from '@clerk/nextjs';
import { EmailAddress } from './email-address';

interface AccessDeniedProps {
  email: string | null;
  /** `ADMIN_ACCESS_CONTACT`, trimmed. Null when unset. */
  accessContact: string | null;
  /** Landing origin: where a plain sign-out ends up. */
  landingHomeUrl: string;
  /** Only true in development when `ADMIN_ALLOWED_EMAILS` is unset or empty. */
  showMissingAllowlistHint: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AccessContact({ contact }: { contact: string | null }) {
  if (!contact) {
    return <>Pide acceso al responsable de la consola.</>;
  }
  if (EMAIL_PATTERN.test(contact)) {
    return (
      <>
        Para pedir acceso, escribe a{' '}
        <a
          href={`mailto:${contact}`}
          className="font-sans font-bold text-info underline underline-offset-4"
        >
          <EmailAddress email={contact} />
        </a>
        .
      </>
    );
  }
  return <>Para pedir acceso, contacta con {contact}.</>;
}

export function AccessDenied({
  email,
  accessContact,
  landingHomeUrl,
  showMissingAllowlistHint,
}: AccessDeniedProps) {
  const { signOut } = useClerk();

  return (
    <main className="flex min-h-screen items-start justify-center bg-background px-[var(--spacing-md)] py-[var(--spacing-x2l)]">
      <section
        aria-labelledby="acceso-denegado"
        className="grid w-full min-w-0 max-w-[560px] gap-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-border-default bg-surface p-[var(--spacing-lg)] shadow-panel"
      >
        <h1
          id="acceso-denegado"
          className="m-0 text-balance font-arvo text-2xl font-bold leading-[1.2] text-text"
        >
          No tienes acceso a la consola de operación
        </h1>
        <p className="m-0 max-w-[65ch] text-pretty text-md leading-[1.5] text-muted">
          Iniciaste sesión como{' '}
          <strong className="text-brand-dark">
            {email ? <EmailAddress email={email} className="font-sans" /> : 'una cuenta sin email'}
          </strong>
          , pero esa cuenta no está en la lista de operadores autorizados. Si tienes otra cuenta con
          acceso, entra con ella.
        </p>
        <p className="m-0 max-w-[65ch] text-pretty text-md leading-[1.5] text-text">
          <AccessContact contact={accessContact} />
        </p>
        {showMissingAllowlistHint ? (
          // Static configuration note, present on first render: not an alert.
          // AppAlert hard-codes role="alert", which would interrupt screen readers.
          // Development only, so the audience is the developer: the variable name
          // is the fix and stays visible here.
          <aside
            aria-labelledby="falta-lista-acceso"
            className="grid gap-[var(--spacing-xs)] rounded-[var(--radius-md)] border border-warning/40 bg-feedback-warning-soft p-[var(--spacing-md)]"
          >
            <h2
              id="falta-lista-acceso"
              className="m-0 text-sm font-bold leading-[1.4] text-brand-dark"
            >
              Falta configurar la lista de acceso
            </h2>
            <p className="m-0 text-sm leading-[1.45] text-text">
              <code>ADMIN_ALLOWED_EMAILS</code> no está definida o está vacía, así que la consola
              deniega el acceso a todo el mundo. Añádela en <code>apps/admin/.env.local</code> con
              los emails separados por comas y reinicia el servidor de desarrollo. Este aviso solo
              aparece en desarrollo.
            </p>
          </aside>
        ) : null}
        <div className="flex flex-wrap gap-[var(--spacing-sm)]">
          {/* Sign out, then the /sign-in bridge sends them back to this console. */}
          <AppButton
            variant="primary"
            compact
            fullWidth={false}
            onPress={() => signOut({ redirectUrl: '/sign-in' })}
          >
            Usar otra cuenta
          </AppButton>
          <AppButton
            variant="neutral"
            compact
            fullWidth={false}
            onPress={() => signOut({ redirectUrl: landingHomeUrl })}
          >
            Cerrar sesión
          </AppButton>
        </div>
      </section>
    </main>
  );
}
