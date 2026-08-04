'use client';

import { ExportMenu } from '../ExportMenu';
import type { PaletteColor, ResultImageSet } from '@17suit/module-sixteen-pixel-perfect';

interface ExportStepProps {
  result: ResultImageSet | null;
  ready: boolean;
}

/**
 * Step 3 — Exportación. The preview and palette live in the persistent
 * right column; this step just exposes the file downloads and a status
 * hint when the pipeline hasn't produced anything yet.
 */
export function ExportStep({ result, ready }: ExportStepProps) {
  if (!ready || !result) {
    return (
      <div className="rounded-md border border-border/60 p-4 text-sm text-muted-foreground">
        Esperando pipeline. Vuelve cuando aparezca el preview pixel-art en la columna derecha.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-400">
        Pixel-art listo en{' '}
        <span className="font-mono">
          {result.pixelated.width}×{result.pixelated.height}
        </span>
        . Descargá cualquiera de los formatos abajo; el bundle ZIP los trae todos.
      </div>
      <ExportMenu
        pixelated={result.pixelated}
        preview={result.preview}
        palette={result.palette as PaletteColor[]}
        config={result.recipe}
      />
    </div>
  );
}
