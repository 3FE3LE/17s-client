import type { SuitTheme } from '@17suit/design-system';
import type { CSSProperties, PropsWithChildren } from 'react';
import { Children } from 'react';
import { useAppTheme } from '../theme/theme-context';

export interface AppButtonGroupProps extends PropsWithChildren {
  direction?: 'row' | 'column';
  gap?: keyof SuitTheme['spacing'];
  stretch?: boolean;
  style?: CSSProperties;
}

export function AppButtonGroup({
  children,
  direction = 'row',
  gap = 'sm',
  stretch = true,
  style,
}: AppButtonGroupProps) {
  const { theme } = useAppTheme();
  const items = Children.toArray(children);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: theme.spacing[gap],
        width: '100%',
        ...style,
      }}
    >
      {items.map((child, index) => (
        <div key={index} style={stretch ? { flex: 1 } : undefined}>
          {child}
        </div>
      ))}
    </div>
  );
}
