'use client';

import type { ProcessingConfig } from '@17suit/module-sixteen-pixel-perfect';

import { SmallButton } from './form/SmallButton';

interface AspectRatioProps {
  config: ProcessingConfig;
  onChange: (cfg: ProcessingConfig) => void;
}

const ASPECTS: ReadonlyArray<{ label: string; ratio: number; orient: 'landscape' | 'portrait' }> = [
  { label: '16:9', ratio: 16 / 9, orient: 'landscape' },
  { label: '4:3', ratio: 4 / 3, orient: 'landscape' },
  { label: '3:2', ratio: 3 / 2, orient: 'landscape' },
  { label: '1:1', ratio: 1, orient: 'square' as never },
  { label: '3:4', ratio: 3 / 4, orient: 'portrait' },
  { label: '9:16', ratio: 9 / 16, orient: 'portrait' },
];

type Orientation = 'landscape' | 'portrait' | 'square';

function dims(aspect: number, orientation: Orientation, base: number): { w: number; h: number } {
  if (orientation === 'landscape') {
    return { w: base, h: Math.round(base / aspect) };
  }
  if (orientation === 'portrait') {
    return { w: Math.round(base * aspect), h: base };
  }
  return { w: base, h: base };
}

function aspectOf(w: number, h: number): number {
  return w / h;
}

function fitOrientation(w: number, h: number): Orientation {
  if (Math.abs(w - h) <= 1) return 'square';
  return w > h ? 'landscape' : 'portrait';
}

/**
 * Aspect ratio presets + orientation toggle. Changing either dimension re-
 * computes the other so canvas dimensions stay anchored to the chosen
 * aspect family.
 */
export function AspectRatio({ config, onChange }: AspectRatioProps) {
  const orientation = fitOrientation(config.canvas.w, config.canvas.h);
  const currentAspect = aspectOf(config.canvas.w, config.canvas.h);

  function applyAspect(aspect: number, orient: Orientation) {
    // Use the larger current dimension as the "base" so flipping
    // orientation doesn't shrink things.
    const base = Math.max(config.canvas.w, config.canvas.h);
    const next = dims(aspect, orient, base);
    onChange({ ...config, canvas: { ...config.canvas, w: next.w, h: next.h } });
  }

  function applyOrientation(target: Orientation) {
    const cur = currentAspect;
    const base = Math.max(config.canvas.w, config.canvas.h);
    const next = dims(cur, target, base);
    onChange({ ...config, canvas: { ...config.canvas, w: next.w, h: next.h } });
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
            onClick={() => applyOrientation(o)}
            title={
              o === 'landscape'
                ? 'más ancho que alto'
                : o === 'portrait'
                  ? 'más alto que ancho'
                  : 'cuadrado'
            }
          >
            {o === 'landscape' ? '↔' : o === 'portrait' ? '↕' : '■'} {o}
          </SmallButton>
        ))}
      </div>
    </div>
  );
}
