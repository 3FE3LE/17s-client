'use client';

import { encodePalettePng } from '@17suit/module-sixteen-pixel-perfect';
import type { PaletteColor } from '@17suit/module-sixteen-pixel-perfect';

interface PalettePanelProps {
  palette: readonly PaletteColor[];
}

/**
 * Palette panel: chips sorted by usage, each with hex tooltip and count.
 * Hex notation uses upper-case per the HEX/TXT exporter.
 */
export function PalettePanel({ palette }: PalettePanelProps) {
  if (palette.length === 0) {
    return (
      <div className="text-xs text-muted-foreground">Run a pipeline to see extracted palette.</div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Palette ({palette.length} colors)
      </div>
      <div className="grid grid-cols-8 gap-1">
        {palette.map((entry) => (
          <div
            key={entry.index}
            title={`${hex(entry.rgb)} — ${entry.count} pixels`}
            className="aspect-square rounded border border-border/50"
            style={{ backgroundColor: hex(entry.rgb) }}
          />
        ))}
      </div>
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground">hex / counts</summary>
        <ul className="mt-1 flex flex-col gap-0.5 font-mono text-[11px]">
          {palette.map((entry) => (
            <li key={entry.index} className="flex justify-between">
              <span>{hex(entry.rgb)}</span>
              <span className="text-muted-foreground">{entry.count}</span>
            </li>
          ))}
        </ul>
      </details>
      <PalettePngLink palette={palette} />
    </div>
  );
}

function PalettePngLink({ palette }: { palette: readonly PaletteColor[] }) {
  function onDownload() {
    const bytes = encodePalettePng(palette, { cellSize: 32 });
    downloadBlob(new Blob([new Uint8Array(bytes)], { type: 'image/png' }), 'palette.png');
  }
  return (
    <button
      type="button"
      onClick={onDownload}
      className="self-start rounded border border-border px-2 py-1 text-[11px] hover:border-foreground/40"
    >
      Download palette.png
    </button>
  );
}

function hex(rgb: [number, number, number]): string {
  return (
    '#' +
    [rgb[0], rgb[1], rgb[2]]
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
