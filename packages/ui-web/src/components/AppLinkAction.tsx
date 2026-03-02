import type { PropsWithChildren } from 'react';

export interface AppLinkActionProps extends PropsWithChildren {
  onPress?: () => void;
}

export function AppLinkAction({ children, onPress }: AppLinkActionProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="m-0 cursor-pointer border-0 bg-transparent py-xs text-left font-zilla text-md leading-[1.5] tracking-normal text-info no-underline"
    >
      {children}
    </button>
  );
}
