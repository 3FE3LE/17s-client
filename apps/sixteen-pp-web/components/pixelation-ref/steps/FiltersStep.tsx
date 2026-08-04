'use client';

import {
  maxColorsAutoForLogical,
  type BlockMode,
  type DitherMode,
  type ProcessingConfig,
  type QuantAlgorithm,
} from '@17suit/module-sixteen-pixel-perfect';

import { NumField } from '../form/NumField';
import { RadioRow } from '../form/RadioRow';

interface FiltersStepProps {
  config: ProcessingConfig;
  onChange: (cfg: ProcessingConfig) => void;
  onReset: () => void;
}

const BLOCK_MODES: ReadonlyArray<{ value: BlockMode; label: string; hint?: string }> = [
  { value: 'average', label: 'Average', hint: 'media por canal' },
  { value: 'median', label: 'Median', hint: 'percentil 50 — buena fidelidad' },
  { value: 'dominant', label: 'Dominant', hint: 'color más frecuente por bloque' },
];

const QUANT_ALGS: ReadonlyArray<{ value: QuantAlgorithm; label: string; hint?: string }> = [
  { value: 'median-cut', label: 'Median-Cut', hint: 'default · balance velocidad/calidad' },
  { value: 'octree', label: 'Octree', hint: 'más rápido en imágenes grandes' },
];

const DITHER_MODES: ReadonlyArray<{ value: DitherMode; label: string; hint?: string }> = [
  { value: 'none', label: 'None', hint: 'default · nearest-color puro' },
  { value: 'floyd-steinberg', label: 'Floyd-Steinberg', hint: 'gradientes texturados' },
  { value: 'bayer', label: 'Bayer 4×4', hint: 'patrón ordenado · look retro' },
];

const NORM_OPTIONS: ReadonlyArray<{
  value: 'off' | 'down-to-8' | 'down-to';
  label: string;
  hint?: string;
}> = [
  { value: 'off', label: 'Off', hint: 'sin normalización' },
  { value: 'down-to-8', label: 'Múltiplo de 8', hint: 'reduce hasta múltiplo de 8' },
  { value: 'down-to', label: 'Custom step', hint: 'reducir a múltiplos de N' },
];

/**
 * Step 2 — Filtros. Tuning knobs that transform the canvas-fitted source
 * into the final pixel-art. Preview + palette are owned by the persistent
 * right column in the wizard shell.
 */
export function FiltersStep({ config, onChange, onReset }: FiltersStepProps) {
  const auto = maxColorsAutoForLogical(config.logical.w, config.logical.h);
  return (
    <div className="flex flex-col gap-4">
      <Card title="Modo de bloque (resample)">
        <RadioRow
          options={BLOCK_MODES}
          value={config.pixelation.mode}
          onChange={(v) => onChange({ ...config, pixelation: { mode: v } })}
        />
        <p className="text-[11px] text-muted-foreground">
          Cómo se resume cada bloque de píxeles fuente en un píxel lógico del grid de salida.
        </p>
      </Card>

      <Card title="Cuantización (paleta)">
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
              onChange({ ...config, quantization: { ...config.quantization, maxColors: auto } })
            }
            title="auto = clamp(floor(min(W,H)/2), 8, 256)"
            className="rounded border border-border px-2 py-1 text-[11px] hover:border-foreground/40"
          >
            auto ({auto})
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          El techo automático sale de la dimensión más corta del grid lógico.
        </p>
      </Card>

      <Card title="Normalización de paleta">
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
          <NumField
            label="step"
            value={config.normalization.step}
            min={2}
            max={256}
            onChange={(v) => onChange({ ...config, normalization: { mode: 'down-to', step: v } })}
          />
        )}
        <p className="text-[11px] text-muted-foreground">
          Reduce la paleta a múltiplos de N fusionando los pares más cercanos.
        </p>
      </Card>

      <Card title="Dithering">
        <RadioRow
          options={DITHER_MODES}
          value={config.dithering.mode}
          onChange={(v) => onChange({ ...config, dithering: { ...config.dithering, mode: v } })}
        />
        {config.dithering.mode !== 'none' && (
          <div className="rounded border border-amber-500/40 bg-amber-500/10 p-2 text-[11px] text-amber-700 dark:text-amber-300">
            Dithering produce gradientes texturados.
          </div>
        )}
      </Card>

      <button
        type="button"
        onClick={onReset}
        className="self-start rounded border border-border bg-background px-3 py-1.5 text-xs hover:border-foreground/40"
      >
        Restablecer filtros a default
      </button>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-md border border-border/60 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
