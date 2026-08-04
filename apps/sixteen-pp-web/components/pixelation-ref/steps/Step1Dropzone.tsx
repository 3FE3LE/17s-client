'use client';

import { useId, useRef } from 'react';

interface Step1DropzoneProps {
  onFile: (file: File) => void;
}

/**
 * Dropzone used inside step 1 (config). Smaller than the hero EmptyState;
 * meant to sit beside the canvas / logical controls once the user is
 * configuring rather than onboarding.
 */
export function Step1Dropzone({ onFile }: Step1DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  return (
    <div
      onDrop={(ev) => {
        ev.preventDefault();
        const file = ev.dataTransfer.files[0];
        if (file) onFile(file);
      }}
      onDragOver={(ev) => ev.preventDefault()}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      className="flex h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/20 text-xs text-muted-foreground hover:border-foreground/40"
    >
      <span className="font-medium text-foreground">Soltá imagen o click</span>
      <span className="text-[10px]">PNG · JPG · WebP · ≤ 32 MP</span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
        className="hidden"
      />
    </div>
  );
}
