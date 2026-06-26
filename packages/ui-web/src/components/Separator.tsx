import type { HTMLAttributes } from 'react';
import { cx } from '@17suit/design-system';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ orientation = 'horizontal', className, ...props }: SeparatorProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx(
        'shrink-0 bg-[rgba(0,23,31,0.12)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
        className,
      )}
    />
  );
}
