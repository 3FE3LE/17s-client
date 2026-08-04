'use client';

import { useMemo, useState } from 'react';

import { SmallButton } from './form/SmallButton';
import type {
  FitMode,
  ProcessingConfig,
  ResultImageSet,
} from '@17suit/module-sixteen-pixel-perfect';
import { encodePngDataUrl } from '@17suit/module-sixteen-pixel-perfect';

type FitModeToggle = 'fit' | 'actual';
const ZOOMS = [1, 2, 4, 8] as const;

const fitObjectClass: Record<FitMode, string> = {
  fit: 'object-contain',
  cover: 'object-cover',
  stretch: 'object-fill',
};

interface PreviewPanelProps {
  config: ProcessingConfig;
  source: { width: number; height: number; originalDataUrl: string } | null;
  result: ResultImageSet | null;
  loading: boolean;
}

/**
 * Persistent preview panel. Lives in the wizard shell, not inside any step
 * — the same view stays visible as the user moves between configuration,
 * filters, and result.
 *
 * Mode A (no pipeline result yet, e.g. step 1):
 *   Shows the source image fitted to the canvas dimensions using CSS
 *   object-fit + focal point. Instant, no worker.
 *
 * Mode B (pipeline result available, steps 2+):
 *   Shows side-by-side: original (full quality) + pixel-art (image-rendering:
 *   pixelated) at the chosen zoom.
 *
 * Width is fixed via `w-full` on a constrained grid column so the preview
 * box's actual pixel size scales with the canvas's aspect ratio — the
 * container's height grows with its width via the CSS `aspect-ratio` rule.
 */
export function PreviewPanel({ config, source, result, loading }: PreviewPanelProps) {
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(2);
  const [fit, setFit] = useState<FitModeToggle>('actual');

  const canvasAspect = `${config.canvas.w} / ${config.canvas.h}`;

  // Focal point as percentages for object-position.
  const focal = config.canvas.focalPoint ?? { x: 0.5, y: 0.5 };
  const objectPosition = `${(focal.x * 100).toFixed(1)}% ${(focal.y * 100).toFixed(1)}%`;

  const pixelatedDataUrl = useMemo(
    () => (result ? encodePngDataUrl(result.pixelated) : undefined),
    [result],
  );

  const showResult = Boolean(pixelatedDataUrl);

  return (
    <aside className="sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col gap-3 overflow-auto rounded-md border border-border bg-background p-3">
      <header className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-muted-foreground">
          Preview
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">{canvasAspect}</span>
      </header>

      {showResult ? (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-2">
            <PreviewCard
              label="Original"
              dimensionLabel={source ? `${source.width} × ${source.height}` : '—'}
              aspectRatio={source ? `${source.width} / ${source.height}` : '16 / 9'}
              src={source?.originalDataUrl}
              alt="original"
            />
            <PreviewCard
              label="Pixel-art (logical)"
              dimensionLabel={
                result ? `${result.pixelated.width} × ${result.pixelated.height}` : '—'
              }
              aspectRatio={
                result ? `${result.pixelated.width} / ${result.pixelated.height}` : '16 / 9'
              }
              src={pixelatedDataUrl}
              alt="pixel-art"
              pixelated
              {...(fit === 'actual' && result
                ? {
                    fixedSize: {
                      w: result.pixelated.width * zoom,
                      h: result.pixelated.height * zoom,
                    },
                  }
                : {})}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
              Zoom
            </span>
            {ZOOMS.map((z) => (
              <SmallButton key={z} active={z === zoom} onClick={() => setZoom(z)}>
                {z}×
              </SmallButton>
            ))}
            <span className="ml-2 font-semibold uppercase tracking-wider text-muted-foreground">
              Fit
            </span>
            <SmallButton active={fit === 'fit'} onClick={() => setFit('fit')}>
              fit
            </SmallButton>
            <SmallButton active={fit === 'actual'} onClick={() => setFit('actual')}>
              actual
            </SmallButton>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-muted-foreground">
            Vista previa del canvas — preview fit en vivo, sin ejecutar pipeline.
          </span>
          <PreviewCard
            label="Canvas-fit"
            dimensionLabel={canvasAspect}
            aspectRatio={canvasAspect}
            src={source?.originalDataUrl}
            alt="canvas preview"
            objectFitClass={fitObjectClass[config.canvas.mode]}
            objectPosition={objectPosition}
          />
          {source && (
            <span className="font-mono text-[11px] text-muted-foreground">
              fuente: {source.width} × {source.height}
            </span>
          )}
        </div>
      )}

      {loading && (
        <div className="rounded border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-[11px] text-sky-700">
          pipeline corriendo…
        </div>
      )}
    </aside>
  );
}

function PreviewCard({
  label,
  dimensionLabel,
  aspectRatio,
  src,
  alt,
  pixelated,
  objectFitClass,
  objectPosition,
  fixedSize,
}: {
  label: string;
  dimensionLabel: string;
  aspectRatio: string;
  src: string | undefined;
  alt: string;
  pixelated?: boolean;
  objectFitClass?: string;
  objectPosition?: string;
  fixedSize?: { w: number; h: number };
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">{dimensionLabel}</span>
      </div>
      <div
        style={{ aspectRatio }}
        className={[
          'relative w-full overflow-auto rounded-md border border-border bg-muted/40',
          pixelated && !fixedSize
            ? 'bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,hsl(var(--background))_0%_50%)] bg-[length:16px_16px]'
            : '',
        ].join(' ')}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{
              ...(pixelated ? { imageRendering: 'pixelated' as const } : {}),
              ...(objectPosition ? { objectPosition } : {}),
              ...(fixedSize
                ? { width: fixedSize.w, height: fixedSize.h }
                : objectFitClass
                  ? { width: '100%', height: '100%', objectFit: objectFitClass as 'contain' }
                  : {}),
            }}
            className={fixedSize ? 'block' : 'h-full w-full'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            sin imagen
          </div>
        )}
      </div>
    </div>
  );
}
