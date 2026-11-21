'use client';

import { AppButton, AppFrame } from '@17suit/ui';
import { UserButton } from '@clerk/nextjs';

interface AdminHomeProps {
  operatorEmail: string | null;
}

export function AdminHome({ operatorEmail }: AdminHomeProps) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="px-lg pt-lg">
        <div className="mx-auto flex w-full max-w-[var(--container-content)] items-center justify-end gap-sm">
          <p className="m-0 min-w-0 truncate font-zilla text-sm leading-[1.4] text-muted">
            <span className="sr-only">Sesion iniciada como </span>
            {operatorEmail ?? 'Operador sin email'}
          </p>
          <UserButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <AppFrame
          appName="Admin Web"
          subtitle="Control plane para tenants, analytics, billing y feature flags."
        >
          <AppButton>Shared UI Button</AppButton>
        </AppFrame>
      </main>
    </div>
  );
}
