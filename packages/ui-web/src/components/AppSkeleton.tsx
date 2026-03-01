import type { CSSProperties, HTMLAttributes } from 'react';
import { useAppTheme } from '../theme/theme-context';

const SKELETON_KEYFRAMES = `
@keyframes appSkeletonPulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
`;

export interface AppSkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  width?: number | string;
  height?: number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  style?: CSSProperties;
}

export function AppSkeleton({
  width = '100%',
  height = 16,
  rounded = 'md',
  style,
  ...rest
}: AppSkeletonProps) {
  const { theme } = useAppTheme();
  const radiusMap = {
    sm: theme.borderRadius.sm,
    md: theme.borderRadius.md,
    lg: theme.borderRadius.lg,
    full: theme.borderRadius.full,
  };

  return (
    <>
      <style>{SKELETON_KEYFRAMES}</style>
      <div
        {...rest}
        aria-hidden
        style={{
          width,
          height,
          borderRadius: radiusMap[rounded],
          backgroundColor: theme.grayscale[3],
          animation: 'appSkeletonPulse 1.2s ease-in-out infinite',
          ...style,
        }}
      />
    </>
  );
}
