'use client';

import { AppSkeleton } from '@17suit/ui';

// Mirrors the overview layout: section heading, provenance note, then the
// products table (md and up) or the stacked product list (below md).
const rows = ['fila-1', 'fila-2', 'fila-3', 'fila-4', 'fila-5'];
const columns = ['producto', 'subdominio', 'superficies', 'accesos'];
const cell = 'px-[var(--spacing-md)] py-[var(--spacing-sm)]';

export default function ConsoleLoading() {
  return (
    <div role="status" aria-live="polite" className="grid gap-[var(--spacing-sm)]">
      <span className="sr-only">Cargando sección…</span>
      <div className="grid gap-[var(--spacing-xs)]">
        <AppSkeleton width={200} height={22} />
        <AppSkeleton width="min(65ch, 100%)" height={16} />
      </div>

      <div className="grid gap-[var(--spacing-sm)] md:hidden">
        {rows.map((row) => (
          <div
            key={row}
            className="grid gap-[var(--spacing-xs)] rounded-[var(--radius-lg)] border border-border-default bg-surface p-[var(--spacing-md)]"
          >
            <AppSkeleton width="60%" height={20} />
            <AppSkeleton width="45%" height={16} />
            <AppSkeleton width={72} height={32} />
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-border-default bg-surface md:block">
        <div className="grid grid-cols-[1.4fr_1.4fr_1fr_1fr] border-b border-border-default">
          {columns.map((column) => (
            <div key={column} className={cell}>
              <AppSkeleton width="50%" height={16} />
            </div>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={row}
            className="grid grid-cols-[1.4fr_1.4fr_1fr_1fr] items-center border-b border-border-hairline last:border-b-0"
          >
            <div className={cell}>
              <AppSkeleton width="75%" height={18} />
            </div>
            <div className={cell}>
              <AppSkeleton width="80%" height={18} />
            </div>
            <div className={cell}>
              <AppSkeleton width="55%" height={18} />
            </div>
            <div className={cell}>
              <AppSkeleton width={64} height={32} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
