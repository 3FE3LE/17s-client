'use client';

interface RadioRowProps<T extends string> {
  options: ReadonlyArray<{ value: T; label: string; hint?: string }>;
  value: T;
  onChange: (v: T) => void;
  label?: string;
}

export function RadioRow<T extends string>({ options, value, onChange, label }: RadioRowProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="flex flex-wrap gap-1">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              title={o.hint}
              className={[
                'rounded border px-3 py-1 text-[11px] transition-colors',
                active
                  ? 'border-foreground bg-foreground font-medium text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
              ].join(' ')}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
