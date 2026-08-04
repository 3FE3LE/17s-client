'use client';

import { useId, useRef } from 'react';

interface ImageDropzoneProps {
  onFile: (file: File) => void;
  filename?: string;
  hasImage: boolean;
  /** Optional dim helper for showing "nuevo" affordance while image is loaded. */
  compact?: boolean;
}

/**
 * Compact dropzone used in the side rail once an image is already loaded.
 * Replaces the file with a click; shows the active filename and a "change"
 * affordance to make it obvious the widget is still interactive.
 */
export function ImageDropzone({ onFile, filename, hasImage, compact = false }: ImageDropzoneProps) {
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

  function onClickPick() {
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-xs font-medium text-foreground">
        Source image
      </label>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onClickPick}
        role="button"
        tabIndex={0}
        className={[
          'flex cursor-pointer flex-col items-stretch gap-2 rounded-md border border-dashed px-3 py-2',
          hasImage ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-muted/30',
          compact ? 'min-h-12' : 'min-h-20',
          'transition-colors hover:border-foreground/40',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-foreground" title={filename ?? ''}>
            {hasImage ? (filename ?? 'imagen cargada') : 'Drop / click'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClickPick();
            }}
            className="rounded border border-border px-2 py-0.5 text-[11px] hover:border-foreground/40"
          >
            Cambiar
          </button>
        </div>
        {!hasImage && (
          <span className="text-[10px] text-muted-foreground">PNG · JPG · WebP · ≤ 32 MP</span>
        )}
      </div>
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
