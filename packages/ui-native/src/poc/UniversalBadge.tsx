/**
 * PoC native renderer for the universal Badge contract (not exported).
 * Same props and class recipe as the web renderer; Uniwind resolves the
 * classes against the shared Tailwind v4 tokens.
 */
import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

import {
  badgeLabelRecipe,
  badgeRecipe,
  type BadgeContractProps,
} from '@17suit/design-system/poc/badge.contract';

export function UniversalBadge({
  children,
  accessibilityLabel,
  ...contract
}: PropsWithChildren<BadgeContractProps>) {
  return (
    <View
      className={badgeRecipe({ ...contract, platform: 'native' })}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <Text className={badgeLabelRecipe(contract)}>{children}</Text>
    </View>
  );
}
