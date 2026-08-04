'use client';

import { useMemo, useState } from 'react';

interface PreviewCanvasProps {
  originalDataUrl?: string;
  pixelatedDataUrl?: string;
  originalSize?: { w: number; h: number };
  pixelatedSize?: { w: number; h: number };
  loading?: boolean;
}

type FitMode = 'fit' | 'actual';

const ZOOMS = [1, 2, 4, 8] as const;

/**
 * Side-by-side previews: original (smoothing ON) and pixel-art (smoothing OFF
 * via `image-rendering: pixelated`). The preview area uses the *pixelated*
 * image's aspect ratio when available, falling back to the source. `fit`
 * letterboxes inside the container; `actual` lets the image render at its
 * natural CSS pixel size (1 logical pixel = `zoom` device pixels for the
 * pixel-art image).
 */
export function PreviewCanvas({
  originalDataUrl,
  pixelatedDataUrl,
  originalSize,
  pixelatedSize,
  loading,
}: PreviewCanvasProps) {
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(2);
  const [fit, setFit] = useState<FitMode>('actual');
  const pixelStyle = useMemo(() => ({ imageRendering: 'pixelated' as const }), []);

  // Choose aspect for the container: prefer the pixelated grid so what the
  // user is configuring matches what they see. Fall back to the source.
  const aspect = pixelatedSize ?? originalSize ?? { w: 16, h: 9 };

  const aspectStyle = useMemo(
    () => ({ aspectRatio: `${aspect.w} / ${aspect.h}` }),
    [aspect.w, aspect.h],
  );

  const fitting = fit === 'fit';
  const objectClass = fitting ? 'object-contain' : 'object-none';
  const imageSizeStyle =
    fit === 'actual' && pixelatedSize
      ? ({ width: pixelatedSize.w * zoom, height: pixelatedSize.h * zoom } as const)
      : undefined;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-muted-foreground">Zoom</span>
        {ZOOMS.map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => setZoom(z)}
            aria-pressed={z === zoom}
            className={[
              'rounded border px-2 py-1 text-[11px] transition-colors',
              z === zoom
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
            ].join(' ')}
          >
            {z}×
          </button>
        ))}
        <span className="ml-3 font-semibold uppercase tracking-wider text-muted-foreground">
          Fit
        </span>
        {(['fit', 'actual'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setFit(m)}
            aria-pressed={fit === m}
            className={[
              'rounded border px-2 py-1 text-[11px] transition-colors',
              fit === m
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
            ].join(' ')}
          >
            {m === 'fit' ? 'fit' : 'actual'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PreviewCard
          label="Original"
          {...(originalSize ? { dimensionLabel: `${originalSize.w} × ${originalSize.h}` } : {})}
          aspectStyle={aspectStyle}
          {...(loading ? { loading: true } : {})}
        >
          {originalDataUrl ? (
            <img src={originalDataUrl} alt="original" className={`h-full w-full ${objectClass}`} />
          ) : (
            <EmptyHint text="cargá una imagen" />
          )}
        </PreviewCard>

        <PreviewCard
          label="Pixel-art (logical)"
          dimensionLabel={pixelatedSize ? `${pixelatedSize.w} × ${pixelatedSize.h}` : '—'}
          aspectStyle={aspectStyle}
          pixelated
          {...(loading ? { loading: true } : {})}
        >
          {pixelatedDataUrl ? (
            <img
              src={pixelatedDataUrl}
              alt="pixel-art"
              style={{ ...pixelStyle, ...(imageSizeStyle ?? {}) }}
              className={`${fitting ? 'h-full w-full' : ''} object-${fitting ? 'contain' : 'none'}`}
            />
          ) : (
            <EmptyHint text="esperando pipeline…" />
          )}
        </PreviewCard>
      </div>

      <p className="text-[11px] text-muted-foreground">
        pixel-art preview usa <code>image-rendering: pixelated</code> — sin suavizado. En modo{' '}
        <code>actual</code> cada píxel lógico mide <code>{zoom}px</code> CSS.
      </p>
    </div>
  );
}

function PreviewCard({
  label,
  dimensionLabel,
  aspectStyle,
  loading,
  pixelated,
  children,
}: {
  label: string;
  dimensionLabel?: string;
  aspectStyle: React.CSSProperties;
  loading?: boolean;
  pixelated?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {dimensionLabel && (
          <span className="font-mono text-[11px] text-muted-foreground">{dimensionLabel}</span>
        )}
      </div>
      <div
        style={aspectStyle}
        className={[
          'relative overflow-auto rounded-md border border-border bg-muted/40',
          pixelated
            ? 'bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,hsl(var(--background))_0%_50%)] bg-[length:16px_16px]'
            : '',
        ].join(' ')}
      >
        {children}
        {loading && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/40">
            <div className="flex items-center gap-2 rounded border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-[11px] text-sky-700">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sky-500" />
              procesando…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
      {text}
    </div>
  );
}
