import {
  badgeLabelRecipe,
  badgeRecipe,
  type BadgeSize,
  type BadgeVariant,
} from '@17suit/design-system';
import type { PropsWithChildren } from 'react';
import { Text, View, type ViewStyle } from 'react-native';

export interface AppBadgeProps extends PropsWithChildren {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
  style?: ViewStyle;
}

/** Native renderer of the shared badge contract (Uniwind classes). */
export function AppBadge({
  children,
  variant = 'neutral',
  size = 'sm',
  rounded = true,
  className,
  style,
}: AppBadgeProps) {
  return (
    <View
      className={badgeRecipe({ variant, size, rounded, platform: 'native', className })}
      style={style}
    >
      <Text className={badgeLabelRecipe({ variant, platform: 'native' })}>{children}</Text>
    </View>
  );
}
