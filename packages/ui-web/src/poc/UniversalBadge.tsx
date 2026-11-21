/**
 * PoC web renderer for the universal Badge contract (not exported).
 * Owns only the DOM primitive and web-only semantics; props and visuals
 * come from @17suit/design-system's badge contract.
 */
import type { PropsWithChildren } from 'react';

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
    <span
      className={badgeRecipe({ ...contract, platform: 'web' })}
      // Native maps accessibilityLabel itself; on web it becomes aria-label.
      aria-label={accessibilityLabel}
    >
      <span className={badgeLabelRecipe(contract)}>{children}</span>
    </span>
  );
}
