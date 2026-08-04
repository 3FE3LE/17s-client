'use client';

import { useState } from 'react';
import {
  buildPixelationBundle,
  encodeGplBytes,
  encodeHexBytes,
  encodePalettePng,
  encodePng,
  serializeRecipeJson,
  type PaletteColor,
  type PixelBuffer,
  type ProcessingConfig,
} from '@17suit/module-sixteen-pixel-perfect';

interface ExportMenuProps {
  pixelated: PixelBuffer;
  preview: PixelBuffer;
  palette: readonly PaletteColor[];
  config: ProcessingConfig;
}

type ExportFormat =
  | 'pixelated.png'
  | 'preview.png'
  | 'palette.png'
  | 'palette.gpl'
  | 'palette.hex'
  | 'recipe.json'
  | 'bundle.zip';

const FORMATS: ReadonlyArray<{ id: ExportFormat; label: string; description: string }> = [
  { id: 'pixelated.png', label: 'pixelated.png', description: 'Logical-resolution PNG.' },
  { id: 'preview.png', label: 'preview.png', description: 'Canvas-size PNG (nearest neighbor).' },
  { id: 'palette.png', label: 'palette.png', description: 'Visual palette chip grid.' },
  { id: 'palette.gpl', label: 'palette.gpl', description: 'GIMP palette (Aseprite compatible).' },
  { id: 'palette.hex', label: 'palette.hex', description: 'HEX / TXT listing with counts.' },
  { id: 'recipe.json', label: 'recipe.json', description: 'Round-trippable ProcessingConfig.' },
  { id: 'bundle.zip', label: 'bundle.zip', description: 'All six files in one archive.' },
];

export function ExportMenu({ pixelated, preview, palette, config }: ExportMenuProps) {
  const [busy, setBusy] = useState<ExportFormat | null>(null);

  function onExport(fmt: ExportFormat) {
    if (busy) return;
    setBusy(fmt);
    try {
      const bytes = buildBytes(fmt);
      const blob = new Blob([new Uint8Array(bytes)], { type: mimeFor(fmt) });
      downloadBlob(blob, fmt);
    } finally {
      setBusy(null);
    }
  }

  function buildBytes(fmt: ExportFormat): Uint8Array {
    if (fmt === 'pixelated.png') return encodePng(pixelated);
    if (fmt === 'preview.png') return encodePng(preview);
    if (fmt === 'palette.png') {
      return encodePalettePng(palette, { cellSize: 32 });
    }
    if (fmt === 'palette.gpl') return encodeGplBytes(palette, 'pixelation-ref');
    if (fmt === 'palette.hex') return encodeHexBytes(palette);
    if (fmt === 'recipe.json') return serializeRecipeJson(config);
    return buildPixelationBundle({ config, pixelated, preview, palette });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Export
      </div>
      <div className="flex flex-col gap-1">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            disabled={busy !== null}
            onClick={() => onExport(f.id)}
            className={[
              'flex items-center justify-between rounded border px-2 py-1.5 text-left text-xs',
              'hover:border-foreground/40 disabled:opacity-50',
            ].join(' ')}
          >
            <span>
              <span className="font-mono">{f.label}</span>
              <span className="ml-2 text-muted-foreground">{f.description}</span>
            </span>
            <span className="text-muted-foreground">{busy === f.id ? '…' : '↓'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function mimeFor(fmt: ExportFormat): string {
  if (fmt.endsWith('.png')) return 'image/png';
  if (fmt.endsWith('.json')) return 'application/json';
  if (fmt.endsWith('.zip')) return 'application/zip';
  return 'text/plain';
}

function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
