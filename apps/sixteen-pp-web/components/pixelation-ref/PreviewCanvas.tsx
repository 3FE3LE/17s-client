'use client';

import { useMemo, useState } from 'react';
import { encodePngDataUrl } from '@17suit/module-sixteen-pixel-perfect';

interface PreviewCanvasProps {
  originalDataUrl?: string;
  pixelatedDataUrl?: string;
}

const ZOOMS = [1, 2, 4] as const;

/**
 * Side-by-side previews: original (smoothing ON) and pixel-art (smoothing OFF
 * via `image-rendering: pixelated`). Zoom toggle scales only the pixel-art
 * preview — the original stays at 1× to preserve the source comparison.
 */
export function PreviewCanvas({ originalDataUrl, pixelatedDataUrl }: PreviewCanvasProps) {
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(2);
  const pixelStyle = useMemo(() => ({ imageRendering: 'pixelated' as const }), []);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-muted-foreground">Zoom</span>
        {ZOOMS.map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => setZoom(z)}
            className={[
              'rounded border px-2 py-1 text-[11px]',
              z === zoom
                ? 'border-foreground bg-foreground text-background'
                : 'border-border hover:border-foreground/40',
            ].join(' ')}
          >
            {z}×
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <PreviewCard label="Original">
          {originalDataUrl ? (
            <img src={originalDataUrl} alt="original" className="h-full w-full object-contain" />
          ) : (
            <EmptyHint text="drop an image to preview" />
          )}
        </PreviewCard>
        <PreviewCard label="Pixel-art">
          {pixelatedDataUrl ? (
            <img
              src={pixelatedDataUrl}
              alt="pixel-art"
              data-zoom={zoom}
              style={pixelStyle}
              className="h-full w-full object-contain"
            />
          ) : (
            <EmptyHint text="run pipeline to preview" />
          )}
        </PreviewCard>
      </div>
      <p className="text-[11px] text-muted-foreground">
        pixel-art preview uses <code>image-rendering: pixelated</code> — no smoothing.
      </p>
    </div>
  );
}

function PreviewCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-muted/40">
        {children}
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

// Re-export for parent components that want to construct data URLs.
export { encodePngDataUrl };
