'use client';

import { AppWorkspaceShell, cx } from '@17suit/ui';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { DeploymentEnvironment } from '@/lib/environment';
import { getSectionByPath } from '@/lib/sections';
import { adminNavItems } from './admin-nav';
import { EmailAddress } from './email-address';
import { EnvironmentBadge } from './environment-badge';

interface AdminShellProps {
  environment: DeploymentEnvironment;
  operatorEmail: string;
  children: ReactNode;
}

// The environment strip sits directly above the shell on every console route so
// production is always visually distinct (destructive tone). The operator identity
// lives in the shell sidebar next to "Cerrar sesión" (`account` prop).
export function AdminShell({ environment, operatorEmail, children }: AdminShellProps) {
  const { signOut } = useClerk();
  const pathname = usePathname();
  const section = getSectionByPath(pathname);
  const isProduction = environment === 'production';

  return (
    <div>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-[var(--spacing-md)] focus:top-[var(--spacing-md)] focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-surface focus:px-[var(--spacing-md)] focus:py-[var(--spacing-sm)] focus:text-sm focus:font-bold focus:text-brand-dark"
      >
        Saltar al contenido
      </a>
      {/*
        Copy rule: the console is read-only today, so the strip only names the
        environment ("Entorno de producción"). When the first write action
        (mutation against 17s-server) lands, production must also warn
        "Estás operando sobre datos reales." next to the badge. Do not show that
        warning before mutations exist: it contradicts the read-only console.
      */}
      <header
        className={cx(
          'relative z-10 flex items-center border-b px-[var(--spacing-md)] py-[var(--spacing-xs)] text-sm leading-[1.4] md:px-[var(--spacing-lg)]',
          isProduction
            ? 'border-destructive/50 bg-feedback-error-soft'
            : 'border-border-default bg-surface',
        )}
      >
        <EnvironmentBadge environment={environment} />
      </header>
      <AppWorkspaceShell
        productName="Admin"
        productKicker="17Suit"
        density="compact"
        title={section?.title ?? 'Consola de operación'}
        navItems={adminNavItems}
        activePath={pathname}
        homeHref="/"
        onSignOut={() => signOut({ redirectUrl: '/sign-in' })}
        signOutLabel="Cerrar sesión"
        account={
          <p className="m-0 min-w-0 text-muted">
            <span className="block">Sesión iniciada como</span>
            <EmailAddress email={operatorEmail} className="block font-bold text-brand-dark" />
          </p>
        }
        linkComponent={Link}
      >
        <div
          id="contenido"
          tabIndex={-1}
          className="grid min-w-0 gap-[var(--spacing-lg)] outline-none"
        >
          {children}
        </div>
      </AppWorkspaceShell>
    </div>
  );
}
