'use client';

interface NumFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

export function NumField({ label, value, min, max, onChange }: NumFieldProps) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="w-4 text-muted-foreground">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isFinite(v)) return;
          onChange(Math.min(max, Math.max(min, Math.round(v))));
        }}
        className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
      />
    </label>
  );
}
