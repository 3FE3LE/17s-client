import { ArrowLeft } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { AppTitle } from './AppTitle';

export interface AppFrameProps extends PropsWithChildren {
  appName: string;
  subtitle?: string;
  onBack?: () => void;
  /**
   * Render the frame as the page's `<main>` landmark (default). Pass `false` when the
   * frame is nested inside another `<main>` (e.g. AppWorkspaceShell).
   */
  landmark?: boolean;
}

export function AppFrame({ appName, subtitle, onBack, landmark = true, children }: AppFrameProps) {
  const Root = landmark ? 'main' : 'div';
  return (
    <Root className="flex flex-1 flex-col bg-background p-lg">
      <div className="mt-md flex w-full max-w-[var(--container-content)] flex-col self-center rounded-xl border border-border-default bg-surface p-lg shadow-panel">
        {typeof onBack === 'function' ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center self-start rounded-md border border-border-default bg-transparent text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary/30"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
        ) : null}
        <AppTitle as={landmark ? 'h1' : 'h2'} text={appName} />
        {subtitle ? (
          <p className="m-0 max-w-[var(--container-measure)] font-zilla text-md leading-[1.5] tracking-normal text-muted">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-lg flex flex-col gap-md">{children}</div>
      </div>
    </Root>
  );
}
