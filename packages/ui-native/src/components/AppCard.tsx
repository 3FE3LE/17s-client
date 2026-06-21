import { cardRecipe, cx } from '@17suit/design-system';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';

type AppCardTone = 'default' | 'accent';

export interface AppCardProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  tone?: AppCardTone;
  onPress?: () => void;
  style?: ViewStyle;
}

export function AppCard({
  children,
  title,
  subtitle,
  footer,
  tone = 'default',
  onPress,
  style,
}: AppCardProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className={cx(
        cardRecipe({ variant: 'feature' }),
        'w-full gap-sm',
        tone === 'accent' && 'border-brand-primary',
        onPress && 'active:opacity-85',
      )}
      style={style}
    >
      {title ? (
        <Text className="font-arvo text-lg font-bold leading-[30px] text-text">{title}</Text>
      ) : null}
      {subtitle ? (
        <Text className="font-zilla text-md leading-[24px] text-muted">{subtitle}</Text>
      ) : null}
      {children}
      {footer ? <View className="mt-xs border-t border-border-default pt-sm">{footer}</View> : null}
    </Container>
  );
}
