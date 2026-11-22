'use client';

import { AppSkeleton } from '@17suit/ui';

// Neutral loading state for the pending sections. Mirrors SectionPending (icon,
// heading, two lines, link) so those routes do not flash the overview's table
// skeleton from app/(console)/loading.tsx.
export function SectionPendingLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid justify-items-center gap-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-dashed border-border-emphasis bg-surface p-[var(--spacing-lg)]"
    >
      <span className="sr-only">Cargando sección…</span>
      <AppSkeleton width={44} height={44} rounded="full" />
      <AppSkeleton width="min(320px, 80%)" height={22} />
      <AppSkeleton width="min(60ch, 90%)" height={16} />
      <AppSkeleton width="min(48ch, 75%)" height={16} />
      <AppSkeleton width={140} height={18} />
    </div>
  );
}
