import { Pressable, Text, View } from 'react-native';
import {
  THEME_PREFERENCES,
  THEME_PREFERENCE_LABELS,
  cx,
  themeToggleLabelRecipe,
  themeToggleOptionRecipe,
  themeToggleRecipe,
} from '@17suit/design-system';

import { useAppTheme } from '../theme/theme-context';

export interface AppThemeToggleProps {
  /** Accessible group label. */
  label?: string;
  className?: string;
}

/**
 * System / Light / Dark segmented control. Same contract and class recipes
 * as the web AppThemeToggle; writes through ThemeProvider.setMode, which
 * drives both the JS theme and Uniwind.setTheme.
 */
export function AppThemeToggle({ label = 'Tema', className }: AppThemeToggleProps) {
  const { mode, setMode } = useAppTheme();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      className={cx(themeToggleRecipe({ platform: 'native' }), className)}
    >
      {THEME_PREFERENCES.map((preference) => {
        const selected = preference === mode;
        return (
          <Pressable
            key={preference}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => setMode(preference)}
            className={themeToggleOptionRecipe({ selected, platform: 'native' })}
          >
            <Text className={themeToggleLabelRecipe({ selected })}>
              {THEME_PREFERENCE_LABELS[preference]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
