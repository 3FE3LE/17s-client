'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CreateConfirmationSchema } from '@17suit/module-nine-care-companion';
import { createBffNineCcDataSource } from '@17suit/module-nine-care-companion/client';

interface Props {
  blockId: string;
}

type Status = 'taken' | 'skipped' | 'unknown';

const OPTIONS: { value: Status; label: string; description: string }[] = [
  {
    value: 'taken',
    label: 'Sí, lo tomó',
    description: 'Registramos la confirmación. Pasamos a la siguiente toma.',
  },
  {
    value: 'skipped',
    label: 'No, lo postergaron',
    description: 'Marcamos como postergada. Avisamos a quien corresponda.',
  },
  {
    value: 'unknown',
    label: 'No estoy segura',
    description: 'Lo dejamos como pendiente para revisitar más tarde.',
  },
];

export function ConfirmForm({ blockId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('taken');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = CreateConfirmationSchema.parse({
        status,
        notes: notes.trim() || undefined,
      });
      await createBffNineCcDataSource('').recordConfirmation(blockId, body);
      router.push(`/care-circle?notice=confirmed`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-[var(--spacing-md)]">
      <fieldset className="grid gap-[var(--spacing-sm)]">
        <legend className="font-arvo text-md text-text">
          ¿Cómo registramos esta toma?
        </legend>
        {OPTIONS.map((opt) => {
          const checked = status === opt.value;
          return (
            <label
              key={opt.value}
              className={
                'flex cursor-pointer items-start gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)] ' +
                (checked
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-border-default bg-canvas')
              }
            >
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={checked}
                onChange={() => setStatus(opt.value)}
                className="mt-1"
              />
              <span>
                <span className="block font-arvo text-md text-text">{opt.label}</span>
                <span className="block text-sm text-muted">{opt.description}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <label className="grid gap-[var(--spacing-sm)]">
        <span className="font-arvo text-md text-text">Notas (opcional)</span>
        <textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          rows={3}
          className="rounded-[var(--radius-md)] border border-border-default bg-canvas p-[var(--spacing-sm)] text-md"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-[var(--radius-md)] border border-brand-primary bg-brand-primary px-[var(--spacing-md)] py-[var(--spacing-sm)] font-arvo text-md text-brand-foreground disabled:opacity-50"
      >
        {isSubmitting ? 'Registrando…' : 'Guardar confirmación'}
      </button>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}
