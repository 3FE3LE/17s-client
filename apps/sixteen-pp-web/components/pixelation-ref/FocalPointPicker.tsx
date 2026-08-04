'use client';

interface FocalPointPickerProps {
  /** Focal point as 0..1 percentages of the canvas. Default [0.5, 0.5]. */
  value: { x: number; y: number };
  onChange: (next: { x: number; y: number }) => void;
}

/**
 * Cover-mode crop focal point picker. Renders a 3×3 grid where each cell
 * positions the source image's center during object-cover cropping. The
 * CSS `object-position` rule is set as percentages so the same focal point
 * applies consistently regardless of the image's intrinsic dimensions.
 */
export function FocalPointPicker({ value, onChange }: FocalPointPickerProps) {
  const cells = [
    { x: 0, y: 0, label: 'top-left' },
    { x: 0.5, y: 0, label: 'top' },
    { x: 1, y: 0, label: 'top-right' },
    { x: 0, y: 0.5, label: 'left' },
    { x: 0.5, y: 0.5, label: 'center' },
    { x: 1, y: 0.5, label: 'right' },
    { x: 0, y: 1, label: 'bottom-left' },
    { x: 0.5, y: 1, label: 'bottom' },
    { x: 1, y: 1, label: 'bottom-right' },
  ] as const;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">Focal point (cover)</span>
      <div
        role="radiogroup"
        aria-label="Focal point for cover crop"
        className="grid h-24 w-32 grid-cols-3 grid-rows-3 overflow-hidden rounded border border-border bg-muted/40"
      >
        {cells.map((c) => {
          const active = Math.abs(value.x - c.x) < 0.01 && Math.abs(value.y - c.y) < 0.01;
          return (
            <button
              key={c.label}
              type="button"
              role="radio"
              aria-checked={active}
              title={c.label}
              onClick={() => onChange({ x: c.x, y: c.y })}
              className={[
                'flex items-center justify-center transition-colors',
                active ? 'bg-foreground text-background' : 'hover:bg-foreground/10',
              ].join(' ')}
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-current opacity-50" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
