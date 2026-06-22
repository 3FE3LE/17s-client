'use client';

import { Toaster } from 'sonner';
import type { ToastProviderProps } from './toast.types';

const DEFAULT_TOAST_DURATION_MS = 4_000;

export function ToastProvider({
  position = 'top-right',
  richColors = true,
  closeButton = true,
  duration = DEFAULT_TOAST_DURATION_MS,
  ...props
}: ToastProviderProps) {
  return (
    <Toaster
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      duration={duration}
      {...props}
    />
  );
}
