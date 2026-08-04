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
 * Persistent preview panel. Two distinct modes:
 *
 *   Mode A (no pipeline result, e.g. step 1) → canvas-fit CSS preview of the
 *     source. Instant. Container aspect ratio follows canvas dimensions
 *     so changing W/H visibly resizes the box. fit-mode and focal-point
 *     are reflected via object-fit / object-position. The active fit-mode
 *     is announced as a prominent badge.
 *
 *   Mode B (pipeline result available, steps 2+) → side-by-side original
 *     + pixel-art with image-rendering: pixelated.
 */
export function PreviewPanel({ config, source, result, loading }: PreviewPanelProps) {
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(2);
  const [fit, setFit] = useState<FitModeToggle>('actual');

  const canvasAspect = `${config.canvas.w} / ${config.canvas.h}`;
  const sourceAspect =
    source && source.width > 0 && source.height > 0 ? `${source.width} / ${source.height}` : null;

  const focal = config.canvas.focalPoint ?? { x: 0.5, y: 0.5 };
  const objectPosition = `${(focal.x * 100).toFixed(1)}% ${(focal.y * 100).toFixed(1)}%`;

  const pixelatedDataUrl = useMemo(
    () => (result ? encodePngDataUrl(result.pixelated) : undefined),
    [result],
  );

  const showResult = Boolean(pixelatedDataUrl);

  return (
    <aside className="flex flex-col gap-3 rounded-md border border-border bg-background p-3">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Preview
        </span>
        <div className="flex flex-wrap items-center gap-1">
          <FitBadge mode={config.canvas.mode} />
          <span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-foreground">
            canvas {config.canvas.w}×{config.canvas.h}
          </span>
        </div>
      </header>

      {showResult ? (
        <div className="flex flex-col gap-2">
          <PreviewCard
            label="Original"
            dimensionLabel={source ? `${source.width} × ${source.height}` : '—'}
            aspectRatio={sourceAspect ?? '16 / 9'}
            src={source?.originalDataUrl}
            alt="original"
          />
          <PreviewCard
            label="Pixel-art (logical)"
            dimensionLabel={result ? `${result.pixelated.width} × ${result.pixelated.height}` : '—'}
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
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
              Zoom
            </span>
            {ZOOMS.map((z) => (
              <SmallButton
                key={z}
                active={z === zoom}
                pressed={z === zoom}
                onClick={() => setZoom(z)}
              >
                {z}×
              </SmallButton>
            ))}
            <span className="ml-2 font-semibold uppercase tracking-wider text-muted-foreground">
              Fit
            </span>
            <SmallButton
              active={fit === 'fit'}
              pressed={fit === 'fit'}
              onClick={() => setFit('fit')}
            >
              fit
            </SmallButton>
            <SmallButton
              active={fit === 'actual'}
              pressed={fit === 'actual'}
              onClick={() => setFit('actual')}
            >
              actual
            </SmallButton>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <PreviewCard
            label="Canvas-fit"
            dimensionLabel={canvasAspect}
            aspectRatio={canvasAspect}
            src={source?.originalDataUrl}
            alt="canvas preview"
            objectFitClass={fitObjectClass[config.canvas.mode]}
            objectPosition={objectPosition}
            showFocalMarker={config.canvas.mode === 'cover'}
            focal={focal}
          />
          {source && (
            <p className="font-mono text-[11px] text-muted-foreground">
              fuente: <span className="font-semibold">{source.width}</span> ×{' '}
              <span className="font-semibold">{source.height}</span> px
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 rounded border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-[11px] text-sky-700">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sky-500" />
          pipeline corriendo…
        </div>
      )}
    </aside>
  );
}

function FitBadge({ mode }: { mode: FitMode }) {
  const tone =
    mode === 'cover'
      ? 'border-sky-500/40 bg-sky-500/10 text-sky-700'
      : mode === 'stretch'
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-700'
        : 'border-border bg-background text-muted-foreground';
  return (
    <span
      className={`rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tone}`}
    >
      fit: {mode}
    </span>
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
  showFocalMarker,
  focal,
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
  showFocalMarker?: boolean;
  focal?: { x: number; y: number };
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-[10px] text-foreground">{dimensionLabel}</span>
      </div>
      <div
        style={{ aspectRatio }}
        className={[
          'relative w-full overflow-auto rounded-md border border-border bg-muted/40 transition-[aspect-ratio] duration-150',
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
        {showFocalMarker && focal ? <FocalMarker focal={focal} /> : null}
      </div>
    </div>
  );
}

function FocalMarker({ focal }: { focal: { x: number; y: number } }) {
  // Render a small crosshair at the configured focal point inside the
  // canvas-fit card so the user can see exactly what stays in frame.
  const style = {
    left: `${(focal.x * 100).toFixed(2)}%`,
    top: `${(focal.y * 100).toFixed(2)}%`,
  };
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2" style={style}>
        <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-emerald-500" />
        <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-emerald-500" />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}
