'use client';

import {
  LOGICAL_PRESETS,
  maxColorsAutoForLogical,
  type BlockMode,
  type DitherMode,
  type FitMode,
  type ProcessingConfig,
  type QuantAlgorithm,
} from '@17suit/module-sixteen-pixel-perfect';

interface ControlsPanelProps {
  config: ProcessingConfig;
  onChange: (cfg: ProcessingConfig) => void;
}

const FIT_MODES: ReadonlyArray<{ value: FitMode; label: string }> = [
  { value: 'fit', label: 'Fit' },
  { value: 'cover', label: 'Cover' },
  { value: 'stretch', label: 'Stretch' },
];

const BLOCK_MODES: ReadonlyArray<{ value: BlockMode; label: string }> = [
  { value: 'average', label: 'Average' },
  { value: 'median', label: 'Median' },
  { value: 'dominant', label: 'Dominant' },
];

const QUANT_ALGS: ReadonlyArray<{ value: QuantAlgorithm; label: string }> = [
  { value: 'median-cut', label: 'Median-Cut' },
  { value: 'octree', label: 'Octree' },
];

const DITHER_MODES: ReadonlyArray<{ value: DitherMode; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'floyd-steinberg', label: 'Floyd-Steinberg' },
  { value: 'bayer', label: 'Bayer' },
];

const NORM_OPTIONS: ReadonlyArray<{ value: 'off' | 'down-to-8' | 'down-to'; label: string }> = [
  { value: 'off', label: 'Off' },
  { value: 'down-to-8', label: 'Round to 8' },
  { value: 'down-to', label: 'Custom step' },
];

export function ControlsPanel({ config, onChange }: ControlsPanelProps) {
  const auto = maxColorsAutoForLogical(config.logical.w, config.logical.h);
  return (
    <div className="flex flex-col gap-5 text-sm">
      <Section title="Canvas">
        <div className="grid grid-cols-2 gap-2">
          <NumField
            label="W"
            value={config.canvas.w}
            min={64}
            max={4096}
            onChange={(v) => onChange({ ...config, canvas: { ...config.canvas, w: v } })}
          />
          <NumField
            label="H"
            value={config.canvas.h}
            min={64}
            max={4096}
            onChange={(v) => onChange({ ...config, canvas: { ...config.canvas, h: v } })}
          />
        </div>
        <RadioRow
          label="Fit mode"
          options={FIT_MODES}
          value={config.canvas.mode}
          onChange={(v) => onChange({ ...config, canvas: { ...config.canvas, mode: v } })}
        />
      </Section>

      <Section title="Logical resolution">
        <div className="grid grid-cols-2 gap-2">
          <NumField
            label="W"
            value={config.logical.w}
            min={8}
            max={2048}
            onChange={(v) => onChange({ ...config, logical: { ...config.logical, w: v } })}
          />
          <NumField
            label="H"
            value={config.logical.h}
            min={8}
            max={2048}
            onChange={(v) => onChange({ ...config, logical: { ...config.logical, h: v } })}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {LOGICAL_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() =>
                onChange({ ...config, logical: { ...config.logical, w: p.w, h: p.h } })
              }
              className="rounded border border-border px-2 py-1 text-[11px] hover:border-foreground/40"
            >
              {p.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Block mode">
        <RadioRow
          options={BLOCK_MODES}
          value={config.pixelation.mode}
          onChange={(v) => onChange({ ...config, pixelation: { mode: v } })}
        />
      </Section>

      <Section title="Quantization">
        <RadioRow
          options={QUANT_ALGS}
          value={config.quantization.algorithm}
          onChange={(v) =>
            onChange({ ...config, quantization: { ...config.quantization, algorithm: v } })
          }
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">max colors</span>
          <input
            type="number"
            min={2}
            max={256}
            value={config.quantization.maxColors}
            onChange={(e) =>
              onChange({
                ...config,
                quantization: { ...config.quantization, maxColors: Number(e.target.value) },
              })
            }
            className="w-20 rounded border border-border bg-background px-2 py-1 text-xs"
          />
          <button
            type="button"
            onClick={() =>
              onChange({
                ...config,
                quantization: { ...config.quantization, maxColors: auto },
              })
            }
            className="rounded border border-border px-2 py-1 text-[11px]"
            title={`auto = clamp(floor(min(W,H)/2), 8, 256)`}
          >
            auto ({auto})
          </button>
        </div>
      </Section>

      <Section title="Palette normalization">
        <RadioRow
          options={NORM_OPTIONS}
          value={config.normalization.mode}
          onChange={(v) =>
            onChange({
              ...config,
              normalization: v === 'down-to' ? { mode: 'down-to', step: 16 } : { mode: v },
            })
          }
        />
        {config.normalization.mode === 'down-to' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">step</span>
            <input
              type="number"
              min={2}
              max={256}
              value={config.normalization.step}
              onChange={(e) =>
                onChange({
                  ...config,
                  normalization: { mode: 'down-to', step: Number(e.target.value) },
                })
              }
              className="w-20 rounded border border-border bg-background px-2 py-1 text-xs"
            />
          </div>
        )}
      </Section>

      <Section title="Dithering">
        <RadioRow
          options={DITHER_MODES}
          value={config.dithering.mode}
          onChange={(v) => onChange({ ...config, dithering: { ...config.dithering, mode: v } })}
        />
        {config.dithering.mode !== 'none' && (
          <div className="text-[11px] text-amber-600 dark:text-amber-400">
            Dithering produces textured gradients. Best for stylized output.
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function NumField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
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

function RadioRow<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={[
            'rounded border px-2 py-1 text-[11px]',
            o.value === value
              ? 'border-foreground bg-foreground text-background'
              : 'border-border hover:border-foreground/40',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
