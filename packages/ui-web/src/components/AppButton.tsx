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
  style,
  ...rest
}: AppButtonProps) {
  const variantClasses: Record<AppButtonVariant, string> = {
    primary: 'bg-brand-primary text-brand-dark',
    success: 'bg-success text-brand-dark',
    destructive: 'bg-destructive text-brand-light',
    warning: 'bg-warning text-background',
    info: 'bg-info text-brand-light',
    neutral: 'bg-brand-light text-brand-dark',
  };
  const buttonClassName = [
    'inline-flex items-center justify-center rounded-md border border-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-transform duration-150 enabled:hover:-translate-y-px',
    'font-zilla text-md font-bold leading-[1.4] tracking-plus1_25',
    fullWidth ? 'w-full' : 'w-auto',
    compact ? 'min-h-10 px-md py-xs' : 'min-h-11 px-lg py-sm',
    disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer',
    variantClasses[variant],
    typeof rest.className === 'string' ? rest.className : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...rest}
      type="button"
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
