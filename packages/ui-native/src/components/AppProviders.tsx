import type { PropsWithChildren } from 'react';
import { Amaranth_400Regular, Amaranth_700Bold } from '@expo-google-fonts/amaranth';
import { Arvo_400Regular, Arvo_700Bold } from '@expo-google-fonts/arvo';
import {
  ZillaSlab_300Light,
  ZillaSlab_400Regular,
  ZillaSlab_500Medium,
  ZillaSlab_700Bold,
} from '@expo-google-fonts/zilla-slab';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '../theme/theme-context';
import type { ThemeModePreference } from '../theme/theme-context';

export interface AppProvidersProps extends PropsWithChildren {
  themeMode?: ThemeModePreference;
  onThemeModeChange?: (mode: ThemeModePreference) => void;
}

export function AppProviders({ children, themeMode, onThemeModeChange }: AppProvidersProps) {
  const [fontsLoaded] = useFonts({
    Amaranth_400Regular,
    Amaranth_700Bold,
    Arvo_400Regular,
    Arvo_700Bold,
    ZillaSlab_300Light,
    ZillaSlab_400Regular,
    ZillaSlab_500Medium,
    ZillaSlab_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const themeProviderProps: {
    mode?: ThemeModePreference;
    onModeChange?: (mode: ThemeModePreference) => void;
  } = {};

  if (themeMode !== undefined) {
    themeProviderProps.mode = themeMode;
  }

  if (onThemeModeChange !== undefined) {
    themeProviderProps.onModeChange = onThemeModeChange;
  }

  return (
    <ThemeProvider {...themeProviderProps}>
      <SafeAreaProvider>
        <ThemeSafeArea>{children}</ThemeSafeArea>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function ThemeSafeArea({ children }: PropsWithChildren) {
  const { theme } = useAppTheme();
  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {children}
    </SafeAreaView>
  );
}
