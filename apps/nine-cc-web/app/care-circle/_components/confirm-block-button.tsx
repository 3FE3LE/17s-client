'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreateConfirmationSchema,
} from '@17suit/module-nine-care-companion';
import { createBffNineCcDataSource } from '@17suit/module-nine-care-companion/client';

interface Props {
  blockId: string;
  medicationName: string;
  compact?: boolean;
}

type ConfirmStatus = 'taken' | 'skipped' | 'unknown';

const COMPACT_LABELS: Record<ConfirmStatus, string> = {
  taken: 'Sí',
  skipped: 'No',
  unknown: 'No sé',
};

export function ConfirmBlockButton({ blockId, medicationName, compact }: Props) {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState<ConfirmStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handle(status: ConfirmStatus) {
    setSubmitting(status);
    setError(null);
    try {
      const body = CreateConfirmationSchema.parse({ status });
      await createBffNineCcDataSource('').recordConfirmation(blockId, body);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar');
    } finally {
      setSubmitting(null);
    }
  }

  if (compact) {
    return (
      <div className="flex gap-[var(--spacing-sm)]">
        {(['taken', 'skipped'] as const).map((status) => (
          <button
            key={status}
            type="button"
            disabled={isSubmitting !== null}
            onClick={() => handle(status)}
            className="rounded-full border border-border-default bg-canvas px-[var(--spacing-sm)] text-xs uppercase tracking-plus1_5 hover:border-brand-primary disabled:opacity-50"
          >
            {COMPACT_LABELS[status]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-[var(--spacing-md)] flex flex-wrap gap-[var(--spacing-sm)]">
      <button
        type="button"
        disabled={isSubmitting !== null}
        onClick={() => handle('taken')}
        className="rounded-[var(--radius-md)] border border-brand-primary bg-brand-primary px-[var(--spacing-md)] py-[var(--spacing-sm)] font-arvo text-md text-brand-foreground disabled:opacity-50"
      >
        {isSubmitting === 'taken'
          ? 'Registrando…'
          : `Confirmar ${medicationName}`}
      </button>
      <button
        type="button"
        disabled={isSubmitting !== null}
        onClick={() => handle('skipped')}
        className="rounded-[var(--radius-md)] border border-border-default bg-canvas px-[var(--spacing-md)] py-[var(--spacing-sm)] font-arvo text-md text-text disabled:opacity-50"
      >
        Posponer
      </button>
      <button
        type="button"
        disabled={isSubmitting !== null}
        onClick={() => handle('unknown')}
        className="rounded-[var(--radius-md)] border border-border-default bg-canvas px-[var(--spacing-md)] py-[var(--spacing-sm)] font-arvo text-md text-muted disabled:opacity-50"
      >
        No sé
      </button>
      {error ? (
        <p role="alert" className="mt-[var(--spacing-sm)] basis-full text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
