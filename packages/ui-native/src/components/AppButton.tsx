import { buttonLabelRecipe, buttonRecipe, cx, type ButtonIntent } from '@17suit/design-system';
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
      container: 'primary',
      label: 'primary',
    },
    success: {
      container: 'success',
      label: 'success',
    },
    destructive: {
      container: 'danger',
      label: 'danger',
    },
    warning: {
      container: 'warning',
      label: 'warning',
    },
    info: {
      container: 'info',
      label: 'info',
    },
    neutral: {
      container: 'neutral',
      label: 'neutral',
    },
  };
  const colors = variantClasses[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={buttonRecipe({
        intent: colors.container as ButtonIntent,
        shape: 'md',
        platform: 'native',
        disabled,
      })}
    >
      <Text className={cx(buttonLabelRecipe({ intent: colors.label as ButtonIntent }))}>
        {children}
      </Text>
    </Pressable>
  );
}
