import type { PropsWithChildren } from 'react';
import { AppTitle } from './AppTitle';

export interface AppFrameProps extends PropsWithChildren {
  appName: string;
  subtitle?: string;
  onBack?: () => void;
}

const APP_FRAME_BADGE = '17SUIT';

export function AppFrame({ appName, subtitle, onBack, children }: AppFrameProps) {
  return (
    <div className="flex flex-1 flex-col bg-background p-lg">
      <div className="mt-md flex w-full max-w-[var(--container-content)] flex-col self-center rounded-xl bg-surface p-lg shadow-[0_1px_2px_rgba(0,0,0,0.35),0_6px_20px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-sm">
          {typeof onBack === 'function' ? (
            <button
              type="button"
              onClick={onBack}
              className="cursor-pointer rounded-md border border-black/10 bg-transparent px-sm py-xs text-brand-dark"
            >
              ←
            </button>
          ) : null}
          <p className="m-0 font-zilla text-xs font-light uppercase leading-[1.4] tracking-plus1_5 text-info">
            {APP_FRAME_BADGE}
          </p>
        </div>
        <AppTitle text={appName} />
        {subtitle ? (
          <p className="m-0 max-w-[var(--container-measure)] font-zilla text-md leading-[1.5] tracking-normal text-muted">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-lg flex flex-col gap-md">{children}</div>
      </div>
    </div>
  );
}
