import type { PropsWithChildren } from 'react';
import { Pressable, Text } from 'react-native';

type AppButtonVariant = 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'neutral';

export interface AppButtonProps extends PropsWithChildren {
  onPress?: (() => void) | undefined;
  variant?: AppButtonVariant;
  disabled?: boolean;
}

export function AppButton({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
}: AppButtonProps) {
  const variantClasses: Record<AppButtonVariant, { container: string; label: string }> = {
    primary: {
      container: 'bg-brand-primary',
      label: 'text-brand-dark',
    },
    success: {
      container: 'bg-success',
      label: 'text-brand-dark',
    },
    destructive: {
      container: 'bg-destructive',
      label: 'text-brand-light',
    },
    warning: {
      container: 'bg-warning',
      label: 'text-background',
    },
    info: {
      container: 'bg-info',
      label: 'text-brand-light',
    },
    neutral: {
      container: 'bg-brand-light',
      label: 'text-brand-dark',
    },
  };
  const colors = variantClasses[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`w-full min-h-11 items-center justify-center rounded-md border border-black/10 px-lg py-sm ${colors.container} ${disabled ? 'opacity-75' : ''}`}
    >
      <Text
        className={`text-center font-zilla text-md font-bold leading-[22px] tracking-plus1_25 ${colors.label}`}
      >
        {children}
      </Text>
    </Pressable>
  );
}
