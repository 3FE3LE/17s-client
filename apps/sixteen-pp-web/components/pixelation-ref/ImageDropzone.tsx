'use client';

import { useId, useRef } from 'react';

interface ImageDropzoneProps {
  onFile: (file: File) => void;
  filename?: string;
  hasImage: boolean;
}

/**
 * Drag-and-drop image picker. Accepts PNG/JPG/WebP; rejected types trigger
 * a UI hint without leaving any global state. The component is fully
 * event-driven — no `useEffect` is used.
 */
export function ImageDropzone({ onFile, filename, hasImage }: ImageDropzoneProps) {
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
          'flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed',
          hasImage ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-muted/30',
          'text-xs text-muted-foreground transition-colors hover:border-foreground/40',
        ].join(' ')}
      >
        {hasImage ? (
          <span className="font-medium text-foreground">{filename ?? 'image loaded'}</span>
        ) : (
          <>
            <span>Drop PNG/JPG/WebP here</span>
            <span className="text-[10px] opacity-60">or click to pick (≤ 32 MP)</span>
          </>
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
