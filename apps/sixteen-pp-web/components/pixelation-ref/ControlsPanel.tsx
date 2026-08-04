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
  onReset: () => void;
  pipelineState: 'idle' | 'running' | 'done' | 'error';
}

const FIT_MODES: ReadonlyArray<{ value: FitMode; label: string; hint: string }> = [
  { value: 'fit', label: 'Fit', hint: 'encaja con padding transparente' },
  { value: 'cover', label: 'Cover', hint: 'llena recortando el excedente' },
  { value: 'stretch', label: 'Stretch', hint: 'deforma para llenar' },
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
  { value: 'down-to-8', label: 'Multiple of 8' },
  { value: 'down-to', label: 'Custom step' },
];

/** Canvas presets pair with logical presets (2× ratio keeps integer scaling). */
const CANVAS_PRESETS: ReadonlyArray<{ label: string; w: number; h: number; forLogical: string }> = [
  { label: '1280×720', w: 1280, h: 720, forLogical: '640×360 / 320×180 / 160×90' },
  { label: '640×360', w: 640, h: 360, forLogical: '320×180 / 160×90' },
  { label: '320×180', w: 320, h: 180, forLogical: '160×90' },
  { label: '1920×1080', w: 1920, h: 1080, forLogical: '960×540 / 480×270' },
];

export function ControlsPanel({ config, onChange, onReset, pipelineState }: ControlsPanelProps) {
  const auto = maxColorsAutoForLogical(config.logical.w, config.logical.h);
  const canvasAspect = config.canvas.w / config.canvas.h;
  const logicalAspect = config.logical.w / config.logical.h;
  const aspectMismatch = Math.abs(canvasAspect - logicalAspect) > 0.01;

  const scaleX = config.canvas.w / config.logical.w;
  const scaleY = config.canvas.h / config.logical.h;
  const integerScale = Number.isInteger(scaleX) && Number.isInteger(scaleY);

  function setCanvas(field: 'w' | 'h', value: number) {
    const other = field === 'w' ? config.canvas.h : config.canvas.w;
    const keptLogicalAspect = config.logical.w / config.logical.h;
    const next = { ...config.canvas, [field]: value };
    if (aspectMismatch === false && config.canvas.w / config.canvas.h > 0) {
      // Keep canvas aspect in sync with the other field when both axes are user-bound.
      if (field === 'w')
        next.h = Math.max(64, Math.min(4096, Math.round((value / config.canvas.w) * other)));
      if (field === 'h')
        next.w = Math.max(64, Math.min(4096, Math.round((value / config.canvas.h) * other)));
    }
    onChange({ ...config, canvas: next });
    void keptLogicalAspect;
  }

  function setLogical(field: 'w' | 'h', value: number) {
    const next = { ...config.logical, [field]: value };
    onChange({ ...config, logical: next });
  }

  function applyCanvasMultipleOf(factor: 2 | 4 | 8) {
    onChange({
      ...config,
      canvas: {
        ...config.canvas,
        w: config.logical.w * factor,
        h: config.logical.h * factor,
      },
    });
  }

  return (
    <div className="flex flex-col gap-5 text-sm">
      <PipelineBadge state={pipelineState} />

      <Section title="Canvas (preview)">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <NumField
            label="W"
            value={config.canvas.w}
            min={64}
            max={4096}
            onChange={(v) => setCanvas('w', v)}
          />
          <NumField
            label="H"
            value={config.canvas.h}
            min={64}
            max={4096}
            onChange={(v) => setCanvas('h', v)}
          />
          <button
            type="button"
            onClick={onReset}
            title="Restablecer todos los defaults"
            className="self-end rounded border border-border bg-background px-2 py-1 text-[11px] hover:border-foreground/40"
          >
            reset
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {CANVAS_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() =>
                onChange({
                  ...config,
                  canvas: { ...config.canvas, w: p.w, h: p.h },
                })
              }
              title={`Para logical: ${p.forLogical}`}
              className={[
                'rounded border px-2 py-1 text-[11px]',
                p.w === config.canvas.w && p.h === config.canvas.h
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border hover:border-foreground/40',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>

        <RadioRow
          label="Fit mode"
          options={FIT_MODES}
          value={config.canvas.mode}
          onChange={(v) => onChange({ ...config, canvas: { ...config.canvas, mode: v } })}
        />
      </Section>

      <Section title="Logical resolution (output grid)">
        <div className="grid grid-cols-2 gap-2">
          <NumField
            label="W"
            value={config.logical.w}
            min={8}
            max={2048}
            onChange={(v) => setLogical('w', v)}
          />
          <NumField
            label="H"
            value={config.logical.h}
            min={8}
            max={2048}
            onChange={(v) => setLogical('h', v)}
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
              className={[
                'rounded border px-2 py-1 text-[11px]',
                p.w === config.logical.w && p.h === config.logical.h
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border hover:border-foreground/40',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>
        <ScaleReadout
          canvasW={config.canvas.w}
          canvasH={config.canvas.h}
          logicalW={config.logical.w}
          logicalH={config.logical.h}
          aspectMismatch={aspectMismatch}
          integerScale={integerScale}
        />
        <div className="flex flex-wrap gap-1">
          <SmallButton onClick={() => applyCanvasMultipleOf(2)}>canvas = 2× logical</SmallButton>
          <SmallButton onClick={() => applyCanvasMultipleOf(4)}>canvas = 4× logical</SmallButton>
          <SmallButton onClick={() => applyCanvasMultipleOf(8)}>canvas = 8× logical</SmallButton>
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
            onChange={(e) => {
              const raw = Number(e.target.value);
              if (!Number.isFinite(raw)) return;
              const clamped = Math.min(256, Math.max(2, Math.round(raw)));
              onChange({
                ...config,
                quantization: { ...config.quantization, maxColors: clamped },
              });
            }}
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
            className="rounded border border-border px-2 py-1 text-[11px] hover:border-foreground/40"
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
              onChange={(e) => {
                const raw = Number(e.target.value);
                if (!Number.isFinite(raw)) return;
                const clamped = Math.min(256, Math.max(2, Math.round(raw)));
                onChange({
                  ...config,
                  normalization: { mode: 'down-to', step: clamped },
                });
              }}
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
            Dithering produce gradientes texturados. Útil para look 16-bit.
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function SmallButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded border border-border px-2 py-1 text-[11px] hover:border-foreground/40"
    >
      {children}
    </button>
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
  options: ReadonlyArray<{ value: T; label: string; hint?: string }>;
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
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
              title={o.hint}
              aria-pressed={active}
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

function PipelineBadge({ state }: { state: 'idle' | 'running' | 'done' | 'error' }) {
  const cfg = (() => {
    switch (state) {
      case 'running':
        return { color: 'border-sky-500/40 bg-sky-500/10 text-sky-700', label: 'procesando…' };
      case 'done':
        return {
          color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700',
          label: 'actualizado',
        };
      case 'error':
        return { color: 'border-red-500/40 bg-red-500/10 text-red-700', label: 'error' };
      default:
        return {
          color: 'border-border bg-muted/30 text-muted-foreground',
          label: 'esperando imagen',
        };
    }
  })();
  return (
    <div
      className={['flex items-center gap-2 rounded border px-2 py-1 text-[11px]', cfg.color].join(
        ' ',
      )}
    >
      <span
        className={[
          'inline-block h-2 w-2 rounded-full',
          state === 'running' ? 'animate-pulse bg-sky-500' : 'bg-current opacity-60',
        ].join(' ')}
      />
      <span className="font-medium">{cfg.label}</span>
    </div>
  );
}

function ScaleReadout({
  canvasW,
  canvasH,
  logicalW,
  logicalH,
  aspectMismatch,
  integerScale,
}: {
  canvasW: number;
  canvasH: number;
  logicalW: number;
  logicalH: number;
  aspectMismatch: boolean;
  integerScale: boolean;
}) {
  const sx = (canvasW / logicalW).toFixed(2);
  const sy = (canvasH / logicalH).toFixed(2);
  let tone = 'text-muted-foreground';
  let message = `scale ${sx}× / ${sy}×`;
  if (aspectMismatch) {
    tone = 'text-amber-600';
    message = `aspect mismatch (canvas ≠ logical) → preview blocks may not square`;
  } else if (!integerScale) {
    tone = 'text-amber-600';
    message = `non-integer scale (${sx}×, ${sy}×) → preview blocks may not square`;
  } else {
    tone = 'text-emerald-700';
    message = `integer scale ${sx}× — preview blocks are square`;
  }
  return <div className={`text-[11px] ${tone}`}>{message}</div>;
}
