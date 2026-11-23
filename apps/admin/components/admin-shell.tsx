'use client';

import { AppWorkspaceShell } from '@17suit/ui';
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

// The environment badge rides in the shell's sticky sidebar (`statusSlot`), so it
// stays in view on every console route from lg up. Production adds a fixed
// destructive rail along the top edge of the viewport: quiet, persistent at every
// breakpoint, and it takes no layout space. The badge text carries the meaning;
// the rail is the at-a-glance cue.
export function AdminShell({ environment, operatorEmail, children }: AdminShellProps) {
  const { signOut } = useClerk();
  const pathname = usePathname();
  const section = getSectionByPath(pathname);
  const isProduction = environment === 'production';

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-[var(--spacing-md)] focus:top-[var(--spacing-md)] focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-surface focus:px-[var(--spacing-md)] focus:py-[var(--spacing-sm)] focus:text-sm focus:font-bold focus:text-brand-dark"
      >
        Saltar al contenido
      </a>
      {/*
        Copy rule: the console is read-only today, so production only names the
        environment ("Entorno de producción") plus the rail. When the first write
        action (mutation against 17s-server) lands, production must also warn
        "Estás operando sobre datos reales." next to the badge. Do not show that
        warning before mutations exist: it contradicts the read-only console.
      */}
      {isProduction ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-destructive"
        />
      ) : null}
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
        statusSlot={<EnvironmentBadge environment={environment} />}
        account={
          <p className="m-0 min-w-0 text-muted">
            <span className="hidden lg:block">Sesión iniciada como</span>
            <span className="sr-only lg:hidden">Sesión iniciada como </span>
            <EmailAddress
              email={operatorEmail}
              className="block font-sans font-bold text-brand-dark"
            />
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
    </>
  );
}
