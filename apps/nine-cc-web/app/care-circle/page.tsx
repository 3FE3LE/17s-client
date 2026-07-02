import {
  CareCircleSummarySchema,
  DailyTimelineSchema,
  MedicationBlockSummarySchema,
  NINE_CC_POST_AUTH_PATH,
} from '@17suit/module-nine-care-companion';
import { createBffNineCcDataSource } from '@17suit/module-nine-care-companion/client';
import { ConfirmBlockButton } from './_components/confirm-block-button';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CareCirclePage({ searchParams }: PageProps) {
  const params = await searchParams;
  if (params.notice === 'confirmed') {
    // Carry the notice into the page render path; actual banner is rendered inline.
  }

  const dataSource = createBffNineCcDataSource('');
  const summary = await dataSource.getMyCareCircle();

  if (!summary) {
    return (
      <main className="mx-auto max-w-2xl px-[var(--spacing-lg)] py-[var(--spacing-xl)]">
        <h1 className="font-arvo text-3xl text-text">Sin círculo todavía</h1>
        <p className="mt-[var(--spacing-md)] text-md leading-[1.5] text-muted">
          Todavía no pertenecés a un círculo de cuidado. Cuando te inviten, vas a ver
          el estado diario del paciente acá.
        </p>
      </main>
    );
  }

  const circle = CareCircleSummarySchema.parse(summary);
  const today = new Date().toISOString().slice(0, 10);
  const timeline = DailyTimelineSchema.parse(
    await dataSource.getDailyTimeline(circle.patientId, today),
  );
  const next = MedicationBlockSummarySchema.parse(
    await dataSource.getNextMedicationBlock(circle.patientId),
  );

  return (
    <main className="mx-auto max-w-3xl px-[var(--spacing-lg)] py-[var(--spacing-xl)]">
      <header className="mb-[var(--spacing-xl)]">
        <p className="text-xs font-light uppercase tracking-plus1_5 text-muted">
          Círculo de {circle.patientDisplayName}
        </p>
        <h1 className="mt-[var(--spacing-sm)] font-arvo text-4xl text-text">
          Hola, Sara
        </h1>
        <p className="mt-[var(--spacing-sm)] text-md leading-[1.5] text-muted">
          Hoy ({timeline.date}) tenés {circle.blocksToday} tomas configuradas —{' '}
          {circle.blocksConfirmedToday} confirmadas, {circle.blocksPendingToday} pendientes,{' '}
          {circle.blocksMissedToday} perdidas.
        </p>
      </header>

      {next ? (
        <section className="mb-[var(--spacing-xl)] rounded-[var(--radius-lg)] border border-border-default bg-ambient-cyan-orb/20 p-[var(--spacing-lg)]">
          <p className="text-xs font-light uppercase tracking-plus1_5 text-brand-dark">
            Próxima toma
          </p>
          <p className="mt-[var(--spacing-sm)] font-arvo text-2xl text-text">
            {next.voiceLine}
          </p>
          <p className="mt-[var(--spacing-sm)] text-sm text-muted">
            {new Date(next.scheduledAt).toUTCString()}
          </p>
          <ConfirmBlockButton
            blockId={next.id}
            medicationName={next.medicationName}
          />
        </section>
      ) : (
        <section className="mb-[var(--spacing-xl)] rounded-[var(--radius-lg)] border border-border-default bg-success/10 p-[var(--spacing-lg)]">
          <p className="text-md text-text">
            Sin tomas pendientes. Las próximas aparecen acá cuando se acerquen.
          </p>
        </section>
      )}

      <section>
        <h2 className="mb-[var(--spacing-md)] font-arvo text-2xl text-text">
          Timeline de hoy
        </h2>
        <ol className="grid gap-[var(--spacing-sm)]">
          {timeline.blocks.map((block) => (
            <li
              key={block.id}
              className="flex items-center justify-between gap-[var(--spacing-md)] rounded-[var(--radius-md)] border border-border-default bg-canvas px-[var(--spacing-md)] py-[var(--spacing-sm)]"
            >
              <div>
                <p className="font-arvo text-md text-text">
                  {block.medicationName}
                </p>
                <p className="text-xs text-muted">
                  {new Date(block.scheduledAt).toUTCString()} · {block.dosage}
                </p>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <span
                  className={
                    'rounded-full px-[var(--spacing-sm)] text-xs font-light uppercase ' +
                    (block.status === 'CONFIRMED'
                      ? 'bg-brand-primary/20 text-brand-dark'
                      : block.status === 'MISSED'
                        ? 'bg-destructive/20 text-destructive'
                        : block.status === 'POSTPONED'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-muted/20 text-muted')
                  }
                >
                  {block.status.toLowerCase()}
                </span>
                <ConfirmBlockButton
                  blockId={block.id}
                  medicationName={block.medicationName}
                  compact
                />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-[var(--spacing-xl)]">
        <a href={NINE_CC_POST_AUTH_PATH} className="text-sm text-muted underline">
          Volver al inicio
        </a>
      </footer>
    </main>
  );
}
