'use client';

import type { ProcessingConfig } from '@17suit/module-sixteen-pixel-perfect';

import { SmallButton } from './form/SmallButton';

interface AspectRatioProps {
  config: ProcessingConfig;
  onChange: (cfg: ProcessingConfig) => void;
}

const ASPECTS: ReadonlyArray<{
  label: string;
  ratio: number;
  orient: 'landscape' | 'portrait' | 'square';
}> = [
  { label: '16:9', ratio: 16 / 9, orient: 'landscape' },
  { label: '4:3', ratio: 4 / 3, orient: 'landscape' },
  { label: '3:2', ratio: 3 / 2, orient: 'landscape' },
  { label: '1:1', ratio: 1, orient: 'square' },
  { label: '3:4', ratio: 3 / 4, orient: 'portrait' },
  { label: '9:16', ratio: 9 / 16, orient: 'portrait' },
];

type Orientation = 'landscape' | 'portrait' | 'square';

function dims(aspect: number, orientation: Orientation, base: number): { w: number; h: number } {
  if (orientation === 'landscape') return { w: base, h: Math.max(8, Math.round(base / aspect)) };
  if (orientation === 'portrait') return { w: Math.max(8, Math.round(base * aspect)), h: base };
  return { w: base, h: base };
}

function aspectOf(w: number, h: number): number {
  return w / h;
}

function fitOrientation(w: number, h: number): Orientation {
  if (Math.abs(w - h) <= 1) return 'square';
  return w > h ? 'landscape' : 'portrait';
}

export function roundToStep(n: number, step: number, min: number): number {
  return Math.max(min, Math.round(n / step) * step);
}

/**
 * Round both dimensions up/down to the nearest multiple of `step` and clamp
 * to a minimum of `min`. Inputs never escape this constraint.
 */
export function snapDimensions(
  w: number,
  h: number,
  multiplesOf: number,
  min = 8,
): { w: number; h: number } {
  return {
    w: roundToStep(w, multiplesOf, min),
    h: roundToStep(h, multiplesOf, min),
  };
}

/**
 * Aspect ratio presets + orientation toggle. Changing either dimension re-
 * computes the other so canvas dimensions stay anchored to the chosen
 * aspect family. Result is also rounded to multiples of 8 so free-typed
 * values cannot slip through arbitrary.
 */
export function AspectRatio({ config, onChange }: AspectRatioProps) {
  const orientation = fitOrientation(config.canvas.w, config.canvas.h);
  const currentAspect = aspectOf(config.canvas.w, config.canvas.h);

  function applyAspect(aspect: number, orient: Orientation) {
    const base = Math.max(config.canvas.w, config.canvas.h);
    const next = dims(aspect, orient, base);
    const clamped = snapDimensions(next.w, next.h, 8);
    onChange({ ...config, canvas: { ...config.canvas, w: clamped.w, h: clamped.h } });
  }

  function applyOrientation(target: Orientation) {
    const cur = currentAspect;
    const base = Math.max(config.canvas.w, config.canvas.h);
    const next = dims(cur, target, base);
    const clamped = snapDimensions(next.w, next.h, 8);
    onChange({ ...config, canvas: { ...config.canvas, w: clamped.w, h: clamped.h } });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Aspect ratio</span>
      <div className="flex flex-wrap gap-1">
        {ASPECTS.map((a) => {
          const active = Math.abs(currentAspect - a.ratio) < 0.01;
          return (
            <SmallButton
              key={a.label}
              active={active}
              pressed={active}
              onClick={() => applyAspect(a.ratio, a.orient)}
            >
              {a.label}
            </SmallButton>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">Orientación</span>
        {(['landscape', 'square', 'portrait'] as const).map((o) => (
          <SmallButton
            key={o}
            active={orientation === o}
            pressed={orientation === o}
            onClick={() => applyOrientation(o)}
            title={
              o === 'landscape'
                ? 'más ancho que alto'
                : o === 'portrait'
                  ? 'más alto que ancho'
                  : 'cuadrado'
            }
          >
            <span aria-hidden>{o === 'landscape' ? '↔' : o === 'portrait' ? '↕' : '■'}</span>
            {o}
          </SmallButton>
        ))}
      </div>
    </div>
  );
}
