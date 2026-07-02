import { MedicationBlockInstructionsSchema } from '@17suit/module-nine-care-companion';
import { createBffNineCcDataSource } from '@17suit/module-nine-care-companion/client';
import { notFound, redirect } from 'next/navigation';

import { ConfirmForm } from './_components/confirm-form';

interface PageProps {
  params: Promise<{ blockId?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

export default async function MedicationBlockConfirmPage({
  params,
}: PageProps) {
  const resolved = await params;
  const blockId = resolved.blockId?.[0];
  if (!blockId) redirect('/care-circle');

  const dataSource = createBffNineCcDataSource('');
  let instructions;
  try {
    instructions = await dataSource.getMedicationInstructions(blockId);
  } catch {
    notFound();
  }
  const parsed = MedicationBlockInstructionsSchema.parse(instructions);

  return (
    <main className="mx-auto max-w-xl px-[var(--spacing-lg)] py-[var(--spacing-xl)]">
      <header className="mb-[var(--spacing-xl)]">
        <p className="text-xs font-light uppercase tracking-plus1_5 text-muted">
          {parsed.slotLabelEs}
        </p>
        <h1 className="mt-[var(--spacing-sm)] font-arvo text-3xl text-text">
          {parsed.instructions}
        </h1>
        <p className="mt-[var(--spacing-sm)] text-md text-muted">
          {parsed.patientDisplayName} ·{' '}
          {new Date(parsed.scheduledAt).toUTCString()} ·{' '}
          <span className="uppercase tracking-plus1_5">{parsed.status.toLowerCase()}</span>
        </p>
      </header>

      <ConfirmForm blockId={parsed.blockId} />
    </main>
  );
}
