'use client';

import { AppWorkspaceShell, cx } from '@17suit/ui';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { DeploymentEnvironment } from '@/lib/environment';
import { getSectionByPath } from '@/lib/sections';
import { adminNavItems } from './admin-nav';
import { EnvironmentBadge } from './environment-badge';

interface AdminShellProps {
  environment: DeploymentEnvironment;
  operatorEmail: string;
  children: ReactNode;
}

// AppWorkspaceShell's header only takes strings (eyebrow + title), so the
// environment badge and the signed-in operator live in a context bar rendered
// directly above the shell on every console route.
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
      <header
        className={cx(
          'relative z-10 flex flex-wrap items-center justify-between gap-x-[var(--spacing-md)] gap-y-[var(--spacing-xs)] border-b px-[var(--spacing-md)] py-[var(--spacing-sm)] text-sm leading-[1.4] md:px-[var(--spacing-lg)]',
          isProduction
            ? 'border-destructive/50 bg-feedback-error-soft'
            : 'border-border-default bg-surface',
        )}
      >
        <div className="flex min-w-0 items-center gap-[var(--spacing-sm)]">
          <EnvironmentBadge environment={environment} />
          {isProduction ? (
            <p className="m-0 text-brand-dark">Estás operando sobre datos reales.</p>
          ) : null}
        </div>
        <p className="m-0 min-w-0 truncate text-muted">
          <span className="sr-only">Sesión iniciada como </span>
          <span aria-hidden>Operador: </span>
          <span className="font-bold text-brand-dark">{operatorEmail}</span>
        </p>
      </header>
      <AppWorkspaceShell
        productName="Admin"
        productKicker="17Suit"
        eyebrow="Consola de operación"
        title={section?.title ?? 'Consola de operación'}
        navItems={adminNavItems}
        activePath={pathname}
        homeHref="/"
        onSignOut={() => signOut({ redirectUrl: '/sign-in' })}
        signOutLabel="Cerrar sesión"
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
