import { buttonRecipe, cx, type ButtonIntent } from '@17suit/design-system';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type AppButtonVariant = 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'neutral';

export interface AppButtonProps
  extends PropsWithChildren, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onPress?: (() => void) | undefined;
  variant?: AppButtonVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  compact?: boolean;
}

export function AppButton({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = true,
  compact = false,
  type = 'button',
  style,
  ...rest
}: AppButtonProps) {
  const variantClasses: Record<AppButtonVariant, string> = {
    primary: 'primary',
    success: 'success',
    destructive: 'danger',
    warning: 'warning',
    info: 'info',
    neutral: 'neutral',
  };
  const buttonClassName = cx(
    buttonRecipe({
      intent: variantClasses[variant] as ButtonIntent,
      size: compact ? 'sm' : 'md',
      shape: 'md',
      platform: 'web',
      fullWidth,
      disabled,
    }),
    disabled ? '' : 'cursor-pointer',
    typeof rest.className === 'string' ? rest.className : '',
  );

  return (
    <button
      {...rest}
      type={type}
      onClick={onPress}
      disabled={disabled}
      className={buttonClassName}
      style={{
        ...style,
      }}
    >
      <span className="m-0 text-center">{children}</span>
    </button>
  );
}
