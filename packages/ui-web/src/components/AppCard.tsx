import { cardRecipe, cx } from '@17suit/design-system';
import type { CSSProperties, HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

type AppCardTone = 'default' | 'accent';

export interface AppCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'style'>, PropsWithChildren {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  tone?: AppCardTone;
  onPress?: () => void;
  style?: CSSProperties;
}

export function AppCard({
  children,
  title,
  subtitle,
  footer,
  tone = 'default',
  onPress,
  style,
  ...rest
}: AppCardProps) {
  return (
    <div
      {...rest}
      onClick={onPress}
      role={onPress ? 'button' : undefined}
      tabIndex={onPress ? 0 : undefined}
      className={cx(
        cardRecipe({ variant: 'feature', shadow: 'panel' }),
        'grid w-full gap-sm',
        tone === 'accent' && 'border-brand-primary',
        onPress
          ? 'cursor-pointer transition-transform duration-150 hover:-translate-y-px'
          : 'cursor-default',
        typeof rest.className === 'string' ? rest.className : '',
      )}
      style={style}
    >
      {title ? (
        <p className="m-0 font-arvo text-lg font-bold leading-[1.25] text-text">{title}</p>
      ) : null}
      {subtitle ? (
        <p className="m-0 font-zilla text-md leading-[1.5] text-muted">{subtitle}</p>
      ) : null}
      {children}
      {footer ? <div className="mt-xs border-t border-border-default pt-sm">{footer}</div> : null}
    </div>
  );
}
