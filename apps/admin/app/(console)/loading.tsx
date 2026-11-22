'use client';

import { AppSkeleton } from '@17suit/ui';

const rows = ['fila-1', 'fila-2', 'fila-3', 'fila-4', 'fila-5'];

export default function ConsoleLoading() {
  return (
    <div role="status" aria-live="polite" className="grid gap-[var(--spacing-sm)]">
      <span className="sr-only">Cargando sección…</span>
      <AppSkeleton width={240} height={24} />
      <div className="grid gap-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-border-default bg-surface p-[var(--spacing-md)]">
        {rows.map((row) => (
          <AppSkeleton key={row} height={20} />
        ))}
      </div>
    </div>
  );
}
