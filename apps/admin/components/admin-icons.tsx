import { forwardRef, type ComponentProps, type ReactNode } from 'react';
import type { LucideIcon } from '@17suit/ui';

// `@17suit/ui` re-exports only a small lucide subset and admin does not depend on
// `lucide-react` directly. These three glyphs reproduce lucide's own path data
// (24px grid, 2px round stroke) so the nav keeps one consistent icon style.

type IconProps = ComponentProps<LucideIcon>;

function createIcon(displayName: string, paths: ReactNode): LucideIcon {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size = 24, strokeWidth = 2, color = 'currentColor', ...rest },
    ref,
  ) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
      >
        {paths}
      </svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}

export const Building2Icon = createIcon(
  'Building2Icon',
  <>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </>,
);

export const ToggleRightIcon = createIcon(
  'ToggleRightIcon',
  <>
    <rect width="20" height="12" x="2" y="6" rx="6" ry="6" />
    <circle cx="16" cy="12" r="2" />
  </>,
);

export const ChartColumnIcon = createIcon(
  'ChartColumnIcon',
  <>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </>,
);
