'use client';

interface WizardStepperProps {
  step: 1 | 2 | 3;
  onSelect: (step: 1 | 2 | 3) => void;
  canReachStep2: boolean;
  canReachStep3: boolean;
}

const STEPS: ReadonlyArray<{
  id: 1 | 2 | 3;
  title: string;
  caption: string;
}> = [
  { id: 1, title: 'Configurar', caption: 'Imagen + canvas + logical' },
  { id: 2, title: 'Filtros', caption: 'Bloque + cuantización + dithering' },
  { id: 3, title: 'Resultado', caption: 'Preview + paleta + export' },
];

/**
 * Three-step wizard indicator. Clicking a previous step jumps back;
 * forward steps are locked until prerequisites are met.
 */
export function WizardStepper({
  step,
  onSelect,
  canReachStep2,
  canReachStep3,
}: WizardStepperProps) {
  const canReach = (target: 1 | 2 | 3): boolean => {
    if (target === 1) return true;
    if (target === 2) return canReachStep2;
    return canReachStep3;
  };
  return (
    <ol className="flex items-stretch gap-2 text-xs">
      {STEPS.map((s, idx) => {
        const active = step === s.id;
        const past = step > s.id;
        const reachable = canReach(s.id);
        const status = active
          ? 'actual'
          : past
            ? 'completado'
            : reachable
              ? 'disponible'
              : 'bloqueado';
        return (
          <li key={s.id} className="flex flex-1 items-stretch">
            <button
              type="button"
              onClick={() => reachable && onSelect(s.id)}
              disabled={!reachable}
              aria-current={active ? 'step' : undefined}
              title={
                status === 'bloqueado'
                  ? 'Bloqueado: completar el paso anterior'
                  : STEPS[idx]!.caption
              }
              className={[
                'flex w-full flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left transition-colors',
                active
                  ? 'border-foreground bg-foreground text-background'
                  : past
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700'
                    : reachable
                      ? 'border-border text-foreground hover:border-foreground/40'
                      : 'cursor-not-allowed border-border/50 bg-muted/30 text-muted-foreground/60',
              ].join(' ')}
            >
              <span className="flex w-full items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider opacity-70">
                  Paso {s.id}
                </span>
                <span className="text-[11px] opacity-70">{status}</span>
              </span>
              <span className="text-sm font-medium">{s.title}</span>
              <span className="text-[11px] opacity-70">{STEPS[idx]!.caption}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <span aria-hidden className="mx-1 self-center text-muted-foreground/40">
                →
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
