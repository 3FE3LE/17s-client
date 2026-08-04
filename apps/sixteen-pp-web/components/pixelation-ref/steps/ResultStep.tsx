'use client';

import { useMemo, useState } from 'react';

import { ExportMenu } from '../ExportMenu';
import { PalettePanel } from '../PalettePanel';
import { SmallButton } from '../form/SmallButton';
import type { PaletteColor, ResultImageSet } from '@17suit/module-sixteen-pixel-perfect';
import { encodePngDataUrl } from '@17suit/module-sixteen-pixel-perfect';

interface ResultStepProps {
  source: { width: number; height: number; originalDataUrl: string } | null;
  result: ResultImageSet | null;
  pipelineState: 'idle' | 'running' | 'done' | 'error';
  warnings: readonly string[];
  error: string | null;
}

type FitMode = 'fit' | 'actual';
const ZOOMS = [1, 2, 4, 8] as const;

/**
 * Step 3 — Resultado y exportación. Shows the final pixelated image,
 * the extracted palette, and all export options.
 */
export function ResultStep({ source, result, pipelineState, warnings, error }: ResultStepProps) {
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(2);
  const [fit, setFit] = useState<FitMode>('actual');

  const pixelatedDataUrl = useMemo(
    () => (result ? encodePngDataUrl(result.pixelated) : undefined),
    [result],
  );

  const pixelArtFit = result ? `${result.pixelated.width}px × ${result.pixelated.height}px` : '—';
  const sourceFit = source ? `${source.width} × ${source.height}` : '—';

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-4">
        <PipelineBanner state={pipelineState} warnings={warnings} error={error} />

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-muted-foreground">Zoom</span>
          {ZOOMS.map((z) => (
            <SmallButton key={z} active={z === zoom} onClick={() => setZoom(z)}>
              {z}×
            </SmallButton>
          ))}
          <span className="ml-3 font-semibold uppercase tracking-wider text-muted-foreground">
            Fit
          </span>
          {(['fit', 'actual'] as const).map((m) => (
            <SmallButton key={m} active={fit === m} onClick={() => setFit(m)}>
              {m}
            </SmallButton>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PreviewPane
            label="Original"
            dimensionLabel={sourceFit}
            aspectRatio={source ? `${source.width} / ${source.height}` : '16 / 9'}
            src={source?.originalDataUrl}
            alt="original"
            fit={fit}
            loading={pipelineState === 'running'}
          />
          <PreviewPane
            label="Pixel-art (logical)"
            dimensionLabel={pixelArtFit}
            aspectRatio={
              result ? `${result.pixelated.width} / ${result.pixelated.height}` : '16 / 9'
            }
            src={pixelatedDataUrl}
            alt="pixel-art"
            fit={fit}
            pixelated
            loading={pipelineState === 'running' && !result}
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

        <p className="text-[11px] text-muted-foreground">
          pixel-art preview usa <code>image-rendering: pixelated</code> — sin suavizado. Modo{' '}
          <code>actual</code> renderiza cada píxel lógico como {zoom}px CSS.
        </p>
      </div>

      <aside className="flex flex-col gap-4">
        <PalettePanel palette={result?.palette ?? []} />
        {result && (
          <ExportMenu
            pixelated={result.pixelated}
            preview={result.preview}
            palette={result.palette as PaletteColor[]}
            config={result.recipe}
          />
        )}
      </aside>
    </div>
  );
}

function PreviewPane({
  label,
  dimensionLabel,
  aspectRatio,
  src,
  alt,
  fit,
  pixelated,
  loading,
  fixedSize,
}: {
  label: string;
  dimensionLabel: string;
  aspectRatio: string;
  src: string | undefined;
  alt: string;
  fit: FitMode;
  pixelated?: boolean;
  loading?: boolean;
  fixedSize?: { w: number; h: number };
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">{dimensionLabel}</span>
      </div>
      <div
        style={{ aspectRatio }}
        className={[
          'relative overflow-auto rounded-md border border-border bg-muted/40',
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
              ...(fixedSize
                ? { width: fixedSize.w, height: fixedSize.h }
                : fit === 'fit'
                  ? { width: '100%', height: '100%', objectFit: 'contain' as const }
                  : { width: 'auto', height: 'auto' }),
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            {loading ? 'procesando…' : 'sin imagen'}
          </div>
        )}
      </div>
    </div>
  );
}

function PipelineBanner({
  state,
  warnings,
  error,
}: {
  state: 'idle' | 'running' | 'done' | 'error';
  warnings: readonly string[];
  error: string | null;
}) {
  const paletteLen = state === 'done' ? '' : '';
  const cfg = (() => {
    switch (state) {
      case 'running':
        return {
          color: 'border-sky-500/40 bg-sky-500/10 text-sky-700',
          label: 'pipeline corriendo…',
        };
      case 'done':
        return {
          color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700',
          label: 'pipeline listo',
        };
      case 'error':
        return {
          color: 'border-red-500/40 bg-red-500/10 text-red-700',
          label: 'error en pipeline',
        };
      default:
        return {
          color: 'border-border bg-muted/30 text-muted-foreground',
          label: 'pipeline inactivo',
        };
    }
  })();
  return (
    <div className="flex flex-col gap-2">
      <div
        className={['flex items-center gap-2 rounded border px-3 py-1.5 text-xs', cfg.color].join(
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
        {paletteLen && <span className="ml-auto font-mono opacity-70">{paletteLen}</span>}
      </div>
      {warnings.length > 0 && (
        <ul className="rounded border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
          {warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
      {error && (
        <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
