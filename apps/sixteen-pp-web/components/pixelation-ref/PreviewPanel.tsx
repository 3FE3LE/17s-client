'use client';

import { useMemo, useRef, useState } from 'react';

import { SmallButton } from './form/SmallButton';
import type {
  FitMode,
  ProcessingConfig,
  ResultImageSet,
} from '@17suit/module-sixteen-pixel-perfect';
import { encodePngDataUrl } from '@17suit/module-sixteen-pixel-perfect';

type FitModeToggle = 'fit' | 'actual';
const PREVIEW_SCALES = [0.5, 1, 2, 4, 8] as const;

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
 * Persistent preview panel.
 *
 * Three distinct cards — none of them respond to *changes in unrelated
 * inputs*:
 *
 *   Source card        — uploaded image rendered at its native dimensions;
 *                        zoomed by `sourceScale`. Never reacts to canvas
 *                        aspect ratio, fit mode, or logical grid choice.
 *
 *   Canvas-fit card    — image laid onto the chosen canvas frame. Responds
 *                        to canvas W/H, fit mode, and focal point. Grid
 *                        overlay over the canvas reveals the logical grid
 *                        that the pipeline will produce.
 *
 *   Pixel-art card     — pipeline output at logical dimensions. Zoomed by
 *                        `artScale`, with grid overlay. Shown only when
 *                        the pipeline produces a result.
 */
export function PreviewPanel({ config, source, result, loading }: PreviewPanelProps) {
  const [fit, setFit] = useState<FitModeToggle>('actual');
  const [sourceScale, setSourceScale] = useState<(typeof PREVIEW_SCALES)[number]>(0.5);
  const [artScale, setArtScale] = useState<(typeof PREVIEW_SCALES)[number]>(0.5);
  const [showGrid, setShowGrid] = useState(true);

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

      {source ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
              Zoom fuente
            </span>
            {PREVIEW_SCALES.map((s) => (
              <SmallButton
                key={s}
                active={s === sourceScale}
                pressed={s === sourceScale}
                onClick={() => setSourceScale(s)}
              >
                {s}×
              </SmallButton>
            ))}
          </div>
          <SourcePreviewCard source={source} scale={sourceScale} />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-muted-foreground">
          Canvas-fit
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {config.canvas.w}×{config.canvas.h} · grid {config.logical.w}×{config.logical.h}
        </span>
        <span className="ml-2 font-semibold uppercase tracking-wider text-muted-foreground">
          Grid
        </span>
        <SmallButton active={showGrid} pressed={showGrid} onClick={() => setShowGrid((v) => !v)}>
          {showGrid ? 'on' : 'off'}
        </SmallButton>
      </div>

      <CanvasFitCard
        source={source}
        config={config}
        objectPosition={objectPosition}
        focal={focal}
        showGrid={showGrid}
        scale={0.5}
      />

      {showResult ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
              Zoom pixel-art
            </span>
            {PREVIEW_SCALES.map((s) => (
              <SmallButton
                key={s}
                active={s === artScale && fit === 'actual'}
                pressed={s === artScale && fit === 'actual'}
                onClick={() => {
                  setArtScale(s);
                  setFit('actual');
                }}
              >
                {s}×
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
          <PixelArtCard
            src={pixelatedDataUrl}
            result={result}
            scale={fit === 'actual' ? artScale : 0.5}
            showGrid={showGrid}
            {...(fit === 'actual' && result
              ? { fixedSize: { w: result.pixelated.width, h: result.pixelated.height } }
              : {})}
          />
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 rounded border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-[11px] text-sky-700">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sky-500" />
          pipeline corriendo…
        </div>
      ) : null}
    </aside>
  );
}

/* ------------------------------------------------------------------------- */
/* Card primitives                                                            */
/* ------------------------------------------------------------------------- */

function SourcePreviewCard({
  source,
  scale,
}: {
  source: { width: number; height: number; originalDataUrl: string };
  scale: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const w = Math.max(1, Math.round(source.width * scale));
  const h = Math.max(1, Math.round(source.height * scale));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Fuente (tamaño nativo)
        </span>
        <span className="font-mono text-[10px] text-foreground">
          {source.width} × {source.height} · render {w}×{h}
        </span>
      </div>
      <div
        ref={wrapperRef}
        style={{ width: w, height: h }}
        className="relative overflow-auto rounded-md border border-border bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,hsl(var(--background))_0%_50%)] bg-[length:16px_16px] transition-[width,height] duration-150"
      >
        <img src={source.originalDataUrl} alt="source at native size" className="block" />
      </div>
    </div>
  );
}

function CanvasFitCard({
  source,
  config,
  objectPosition,
  focal,
  showGrid,
  scale,
}: {
  source: PreviewPanelProps['source'];
  config: ProcessingConfig;
  objectPosition: string;
  focal: { x: number; y: number };
  showGrid: boolean;
  scale: number;
}) {
  const w = Math.max(1, Math.round(config.canvas.w * scale));
  const h = Math.max(1, Math.round(config.canvas.h * scale));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Lienzo · imagen encajada
        </span>
        <span className="font-mono text-[10px] text-foreground">
          {config.canvas.w}×{config.canvas.h}
        </span>
      </div>
      <div
        style={{ width: w, height: h }}
        className="relative overflow-auto rounded-md border border-border bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,hsl(var(--background))_0%_50%)] bg-[length:16px_16px] transition-[width,height] duration-150"
      >
        {source ? (
          <img
            src={source.originalDataUrl}
            alt="canvas preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: fitObjectClass[config.canvas.mode] as
                | 'contain'
                | 'cover'
                | 'fill'
                | 'none'
                | 'scale-down',
              objectPosition,
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            sin imagen
          </div>
        )}
        {config.canvas.mode === 'cover' && <FocalMarker focal={focal} />}
        {showGrid && (
          <GridOverlay width={w} height={h} cols={config.logical.w} rows={config.logical.h} />
        )}
      </div>
    </div>
  );
}

function PixelArtCard({
  src,
  result,
  scale,
  showGrid,
  fixedSize,
}: {
  src: string | undefined;
  result: ResultImageSet | null;
  scale: number;
  showGrid: boolean;
  fixedSize?: { w: number; h: number };
}) {
  const w = fixedSize ? Math.round(fixedSize.w * scale) : 0;
  const h = fixedSize ? Math.round(fixedSize.h * scale) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Pixel-art (logical)
        </span>
        <span className="font-mono text-[10px] text-foreground">
          {result ? `${result.pixelated.width} × ${result.pixelated.height}` : '—'}
        </span>
      </div>
      <div
        style={fixedSize ? { width: w, height: h } : undefined}
        className={[
          'relative overflow-auto rounded-md border border-border bg-muted/40 transition-[width,height,aspect-ratio] duration-150',
          !fixedSize ? 'aspect-video' : '',
        ].join(' ')}
      >
        {src ? (
          <img
            src={src}
            alt="pixel-art"
            style={
              fixedSize
                ? {
                    imageRendering: 'pixelated',
                    width: w,
                    height: h,
                  }
                : {
                    imageRendering: 'pixelated',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain' as const,
                  }
            }
            className={fixedSize ? 'block' : 'h-full w-full'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            sin resultado
          </div>
        )}
        {showGrid && fixedSize && result && (
          <GridOverlay
            width={w}
            height={h}
            cols={result.pixelated.width}
            rows={result.pixelated.height}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Decorative overlays                                                       */
/* ------------------------------------------------------------------------- */

function FocalMarker({ focal }: { focal: { x: number; y: number } }) {
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

/**
 * SVG grid overlay. Renders `cols-1` vertical lines + `rows-1` horizontal
 * lines at integer cell boundaries inside the rendered image. Stroke is
 * 1 CSS pixel regardless of the surrounding scale.
 */
function GridOverlay({
  width,
  height,
  cols,
  rows,
}: {
  width: number;
  height: number;
  cols: number;
  rows: number;
}) {
  if (cols < 2 || rows < 2 || width < 8 || height < 8) return null;
  const v: React.ReactElement[] = [];
  for (let c = 1; c < cols; c += 1) {
    const x = (c / cols) * width;
    v.push(
      <line
        key={`v-${c}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="rgb(16 185 129)"
        strokeWidth={1}
        shapeRendering="crispEdges"
      />,
    );
  }
  const h: React.ReactElement[] = [];
  for (let r = 1; r < rows; r += 1) {
    const y = (r / rows) * height;
    h.push(
      <line
        key={`h-${r}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="rgb(16 185 129)"
        strokeWidth={1}
        shapeRendering="crispEdges"
      />,
    );
  }
  return (
    <svg
      width={width}
      height={height}
      className="pointer-events-none absolute inset-0"
      style={{ vectorEffect: 'non-scaling-stroke' as const }}
    >
      <g opacity={0.65}>{v}</g>
      <g opacity={0.65}>{h}</g>
    </svg>
  );
}
