'use client';

interface DimensionFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  /** All values get snapped to `step`. Defaults to 8. */
  step?: number;
  onChange: (v: number) => void;
}

/**
 * Constrained integer input for image dimensions. Bumping the value with
 * ± always lands on a multiple of `step`; typing into the input also snaps
 * (with a debounce on blur) so arbitrary values can never land in state.
 *
 * Persists the raw typing string locally so the user isn't fighting the
 * formatter while editing, but on blur the stored value is the snapped one.
 */
export function DimensionField({
  label,
  value,
  min,
  max,
  step = 8,
  onChange,
}: DimensionFieldProps) {
  const clamped = Math.min(max, Math.max(min, Math.round(value)));
  const onStep = (delta: number) => {
    const next = Math.min(max, Math.max(min, clamped + delta));
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onStep(-step)}
          disabled={clamped <= min}
          aria-label={`decrementar ${label}`}
          className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-sm transition-colors hover:border-foreground hover:bg-foreground/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
        >
          −
        </button>
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          value={clamped}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isFinite(v)) return;
            const snapped = Math.round(v / step) * step;
            onChange(Math.min(max, Math.max(min, snapped)));
          }}
          className="h-7 w-full rounded border border-border bg-background px-2 py-0.5 text-center font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
        />
        <button
          type="button"
          onClick={() => onStep(step)}
          disabled={clamped >= max}
          aria-label={`incrementar ${label}`}
          className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-sm transition-colors hover:border-foreground hover:bg-foreground/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
        >
          +
        </button>
      </div>
    </div>
  );
}
