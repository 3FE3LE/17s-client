import { describe, expect, it } from 'vitest';

import {
  BADGE_VARIANTS,
  badgeLabelRecipe,
  badgeRecipe,
} from '@17suit/design-system/poc/badge.contract';

const strip = (classes: string, platformOnly: string[]) =>
  classes
    .split(' ')
    .filter((c) => !platformOnly.includes(c))
    .sort();

describe('universal badge contract (PoC)', () => {
  it.each(BADGE_VARIANTS)('web and native share every visual class for %s', (variant) => {
    const web = badgeRecipe({ variant, platform: 'web' });
    const native = badgeRecipe({ variant, platform: 'native' });

    expect(strip(web, ['inline-flex', 'whitespace-nowrap'])).toEqual(strip(native, ['self-start']));
  });

  it('keeps platform layout primitives apart', () => {
    expect(badgeRecipe({ platform: 'web' })).toContain('inline-flex');
    expect(badgeRecipe({ platform: 'native' })).toContain('self-start');
    expect(badgeRecipe({ platform: 'native' })).not.toContain('inline-flex');
  });

  it('resolves the label from the same variant on both platforms', () => {
    expect(badgeLabelRecipe({ variant: 'primary' })).toContain('text-foreground-inverse');
  });

  it('appends caller classes last so they can override', () => {
    expect(badgeRecipe({ platform: 'web', className: 'mt-2' }).endsWith('mt-2')).toBe(true);
  });
});
