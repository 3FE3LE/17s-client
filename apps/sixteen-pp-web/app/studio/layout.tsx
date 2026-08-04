import type { ReactNode } from 'react';
import { StudioNav } from '@/components/studio/StudioNav';

/**
 * Shared layout for /studio and its nested routes. Renders the tab nav
 * above the children so both the panel generator and the pixelation
 * reference tool share the same switcher.
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <StudioNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
