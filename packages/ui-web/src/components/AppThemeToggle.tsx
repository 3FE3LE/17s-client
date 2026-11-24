'use client';

import { useId } from 'react';
import {
  THEME_PREFERENCES,
  THEME_PREFERENCE_LABELS,
  cx,
  themeToggleLabelRecipe,
  themeToggleOptionRecipe,
  themeToggleRecipe,
  type ThemePreference,
} from '@17suit/design-system';

import { Monitor, Moon, Sun, type LucideIcon } from '../icons';
import { useAppTheme } from '../theme/theme-context';

const THEME_ICONS: Record<ThemePreference, LucideIcon> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

export interface AppThemeToggleProps {
  /** Visible group label; defaults to a visually hidden "Tema". */
  label?: string;
  showLabel?: boolean;
  /** Option labels (translated by the caller); defaults to the design-system labels. */
  labels?: Partial<Record<ThemePreference, string>>;
  className?: string;
}

/**
 * System / Light / Dark segmented control. Native radio inputs inside a
 * fieldset: keyboard (arrows), screen readers and forms work without ARIA.
 */
export function AppThemeToggle({
  label = 'Tema',
  showLabel = false,
  labels,
  className,
}: AppThemeToggleProps) {
  const { mode, setMode } = useAppTheme();
  const name = useId();

  return (
    <fieldset className={cx('m-0 min-w-0 border-0 p-0', className)}>
      <legend className={showLabel ? 'mb-xs font-zilla text-xs text-muted' : 'sr-only'}>
        {label}
      </legend>
      <div className={themeToggleRecipe({ platform: 'web' })}>
        {THEME_PREFERENCES.map((preference: ThemePreference) => {
          const selected = preference === mode;
          const Icon = THEME_ICONS[preference];
          return (
            <label
              key={preference}
              className={themeToggleOptionRecipe({ selected, platform: 'web' })}
            >
              <input
                type="radio"
                name={name}
                value={preference}
                checked={selected}
                onChange={() => setMode(preference)}
                className="sr-only"
              />
              <span
                className={cx(
                  'inline-flex items-center gap-xs',
                  themeToggleLabelRecipe({ selected }),
                )}
              >
                <Icon aria-hidden size={14} />
                {labels?.[preference] ?? THEME_PREFERENCE_LABELS[preference]}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
