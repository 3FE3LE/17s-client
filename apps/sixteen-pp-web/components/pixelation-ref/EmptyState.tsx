'use client';

import { useId, useRef } from 'react';

interface EmptyStateProps {
  onFile: (file: File) => void;
}

/**
 * Hero empty state. Big dropzone with visual affordance, brief explanation
 * of the pipeline, and a sample button (calls back to a known input —
 * kept as a placeholder for future bundled fixtures).
 */
export function EmptyState({ onFile }: EmptyStateProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (file) onFile(file);
  }

  function onDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    const file = ev.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function onDragOver(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
  }

  function onPick() {
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <header className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold">Cargá una imagen para empezar</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Convertí cualquier PNG/JPG/WebP en una referencia de pixel-art: elegís resolución lógica,
          paleta, dithering, y exportás PNG + GPL + HEX.
        </p>
      </header>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onPick}
        role="button"
        tabIndex={0}
        className={[
          'flex h-72 w-full max-w-2xl cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed',
          'border-border bg-muted/20 text-center transition-colors',
          'hover:border-foreground/40 hover:bg-muted/40',
        ].join(' ')}
      >
        <div className="rounded-full border border-border bg-background p-4 text-3xl">⌬</div>
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">
            Soltá una imagen acá, o hacé click para elegir
          </span>
          <span className="text-xs text-muted-foreground">
            PNG · JPG · WebP · hasta 32 MP · todo se procesa en tu navegador
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPick();
          }}
          className="mt-2 rounded-md border border-foreground bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-foreground/90"
        >
          Elegir archivo
        </button>
      </div>

      <ol className="grid max-w-2xl grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-3">
        <li className="rounded border border-border p-3">
          <span className="block font-medium text-foreground">1 · Resolución lógica</span>
          elegís el grid real de píxeles (ej. 320×180).
        </li>
        <li className="rounded border border-border p-3">
          <span className="block font-medium text-foreground">2 · Cuantización</span>
          mediana u octree, máximo de colores.
        </li>
        <li className="rounded border border-border p-3">
          <span className="block font-medium text-foreground">3 · Exportar</span>
          PNG + GPL + HEX + bundle ZIP, todo determinista.
        </li>
      </ol>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}
