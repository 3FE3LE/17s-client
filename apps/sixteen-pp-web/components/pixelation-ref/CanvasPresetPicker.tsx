'use client';

import type { ProcessingConfig } from '@17suit/module-sixteen-pixel-perfect';

import { SmallButton } from './form/SmallButton';

/**
 * Curated canvas dimensions. The user is NOT free to type — they pick
 * one of these. Aspect + size tier + orientation fully determines W×H.
 *
 * Presets grouped by aspect ratio. Each tier (pequeño / mediano / grande /
 * 4K) maps to a specific (w, h) pair at the current orientation.
 *
 * `landscape` rows: width > height. `portrait` rows: width < height. The
 * orientation flip button swaps W and H in place.
 */

interface SizePreset {
  readonly label: 'pequeño' | 'mediano' | 'grande' | '4K';
  readonly landscape: { readonly w: number; readonly h: number };
  readonly portrait: { readonly w: number; readonly h: number };
}

const CANVAS_PRESETS: ReadonlyArray<{
  aspect: '16:9' | '4:3' | '3:2' | '1:1' | '3:4' | '9:16';
  sizes: readonly [SizePreset, SizePreset, SizePreset, SizePreset];
}> = [
  {
    aspect: '16:9',
    sizes: [
      { label: 'pequeño', landscape: { w: 640, h: 360 }, portrait: { w: 360, h: 640 } },
      { label: 'mediano', landscape: { w: 1280, h: 720 }, portrait: { w: 720, h: 1280 } },
      { label: 'grande', landscape: { w: 1920, h: 1080 }, portrait: { w: 1080, h: 1920 } },
      { label: '4K', landscape: { w: 3840, h: 2160 }, portrait: { w: 2160, h: 3840 } },
    ],
  },
  {
    aspect: '4:3',
    sizes: [
      { label: 'pequeño', landscape: { w: 640, h: 480 }, portrait: { w: 480, h: 640 } },
      { label: 'mediano', landscape: { w: 1024, h: 768 }, portrait: { w: 768, h: 1024 } },
      { label: 'grande', landscape: { w: 1440, h: 1080 }, portrait: { w: 1080, h: 1440 } },
      { label: '4K', landscape: { w: 2048, h: 1536 }, portrait: { w: 1536, h: 2048 } },
    ],
  },
  {
    aspect: '3:2',
    sizes: [
      { label: 'pequeño', landscape: { w: 600, h: 400 }, portrait: { w: 400, h: 600 } },
      { label: 'mediano', landscape: { w: 1200, h: 800 }, portrait: { w: 800, h: 1200 } },
      { label: 'grande', landscape: { w: 1800, h: 1200 }, portrait: { w: 1200, h: 1800 } },
      { label: '4K', landscape: { w: 3000, h: 2000 }, portrait: { w: 2000, h: 3000 } },
    ],
  },
  {
    aspect: '1:1',
    sizes: [
      { label: 'pequeño', landscape: { w: 256, h: 256 }, portrait: { w: 256, h: 256 } },
      { label: 'mediano', landscape: { w: 512, h: 512 }, portrait: { w: 512, h: 512 } },
      { label: 'grande', landscape: { w: 1024, h: 1024 }, portrait: { w: 1024, h: 1024 } },
      { label: '4K', landscape: { w: 2048, h: 2048 }, portrait: { w: 2048, h: 2048 } },
    ],
  },
  {
    aspect: '3:4',
    sizes: [
      { label: 'pequeño', landscape: { w: 600, h: 800 }, portrait: { w: 800, h: 600 } },
      { label: 'mediano', landscape: { w: 900, h: 1200 }, portrait: { w: 1200, h: 900 } },
      { label: 'grande', landscape: { w: 1200, h: 1600 }, portrait: { w: 1600, h: 1200 } },
      { label: '4K', landscape: { w: 1536, h: 2048 }, portrait: { w: 2048, h: 1536 } },
    ],
  },
  {
    aspect: '9:16',
    sizes: [
      { label: 'pequeño', landscape: { w: 360, h: 640 }, portrait: { w: 640, h: 360 } },
      { label: 'mediano', landscape: { w: 720, h: 1280 }, portrait: { w: 1280, h: 720 } },
      { label: 'grande', landscape: { w: 1080, h: 1920 }, portrait: { w: 1920, h: 1080 } },
      { label: '4K', landscape: { w: 2160, h: 3840 }, portrait: { w: 3840, h: 2160 } },
    ],
  },
];

interface CanvasPresetPickerProps {
  config: ProcessingConfig;
  onChange: (cfg: ProcessingConfig) => void;
}

/**
 * Match the canvas's current W/H ratio against the closest preset aspect,
 * and (aspect,w,h) → which size tier matches. Returns null if no preset
 * matches exactly — this happens when the canvas was set by some code path
 * outside the picker (default config + user reset, for example).
 */
function currentMatch(
  w: number,
  h: number,
): {
  aspect: (typeof CANVAS_PRESETS)[number]['aspect'];
  size: SizePreset;
  orient: 'landscape' | 'portrait';
} | null {
  for (const entry of CANVAS_PRESETS) {
    for (const size of entry.sizes) {
      if (size.landscape.w === w && size.landscape.h === h) {
        return { aspect: entry.aspect, size, orient: 'landscape' };
      }
      if (size.portrait.w === w && size.portrait.h === h) {
        return { aspect: entry.aspect, size, orient: 'portrait' };
      }
    }
  }
  return null;
}

function applyAspect(aspect: (typeof CANVAS_PRESETS)[number]['aspect']) {
  // Default to "mediano" size, landscape orientation, when the user
  // switches aspect. Existing canvas aspect ratio is irrelevant by
  // construction.
  return { aspect, sizeIndex: 1, orient: 'landscape' as const };
}

export function CanvasPresetPicker({ config, onChange }: CanvasPresetPickerProps) {
  const match = currentMatch(config.canvas.w, config.canvas.h);
  const aspect = match?.aspect ?? '16:9';
  const orient = match?.orient ?? 'landscape';

  function pickAspect(next: (typeof CANVAS_PRESETS)[number]['aspect']) {
    const { sizeIndex, orient: nextOrient } = applyAspect(next);
    const entry = CANVAS_PRESETS.find((p) => p.aspect === next);
    if (!entry) throw new Error(`unreachable: aspect ${next}`);
    const size = entry.sizes[sizeIndex];
    if (!size) throw new Error('unreachable: size');
    apply(next, nextOrient, size);
  }

  function pickSize(size: SizePreset) {
    apply(aspect, orient, size);
  }

  function pickOrientation(next: 'landscape' | 'portrait') {
    const first = CANVAS_PRESETS[0];
    const fallbackSize = match?.size ?? first?.sizes[1] ?? first?.sizes[0];
    if (!fallbackSize) throw new Error('unreachable: no canvas preset available');
    apply(aspect, next, fallbackSize);
  }

  function apply(
    a: (typeof CANVAS_PRESETS)[number]['aspect'],
    o: 'landscape' | 'portrait',
    size: SizePreset,
  ) {
    const dims = o === 'landscape' ? size.landscape : size.portrait;
    onChange({ ...config, canvas: { ...config.canvas, w: dims.w, h: dims.h } });
    void a;
  }

  const activeEntry = CANVAS_PRESETS.find((p) => p.aspect === aspect);
  if (!activeEntry) throw new Error(`unreachable: aspect ${aspect}`);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Aspect ratio</span>
      <div className="flex flex-wrap gap-1">
        {CANVAS_PRESETS.map((entry) => {
          const active = entry.aspect === aspect;
          return (
            <SmallButton
              key={entry.aspect}
              active={active}
              pressed={active}
              onClick={() => pickAspect(entry.aspect)}
            >
              {entry.aspect}
            </SmallButton>
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">Tamaño (canvas preset)</span>
      <div className="flex flex-wrap gap-1">
        {activeEntry.sizes.map((s) => {
          const active = match?.size === s;
          const dims = orient === 'landscape' ? s.landscape : s.portrait;
          return (
            <SmallButton
              key={s.label}
              active={active}
              pressed={active}
              onClick={() => pickSize(s)}
              title={`${orient === 'landscape' ? '↔' : '↕'} ${dims.w}×${dims.h}`}
            >
              {s.label}
              <span className="ml-1 font-mono text-[10px] opacity-70">
                {dims.w}×{dims.h}
              </span>
            </SmallButton>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">Orientación</span>
        <SmallButton
          active={orient === 'landscape'}
          pressed={orient === 'landscape'}
          onClick={() => pickOrientation('landscape')}
          title="más ancho que alto"
        >
          ↔ landscape
        </SmallButton>
        <SmallButton
          active={orient === 'portrait'}
          pressed={orient === 'portrait'}
          onClick={() => pickOrientation('portrait')}
          title="más alto que ancho"
        >
          ↕ portrait
        </SmallButton>
      </div>
    </div>
  );
}
