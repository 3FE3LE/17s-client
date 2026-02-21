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
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { suitTheme } from '../../theme';
import tamaguiConfig from '../../tamagui.config';
import { PortalProvider, TamaguiProvider } from 'tamagui';
import { AppToastHost } from './toast-host';

const providerConfig = tamaguiConfig as NonNullable<
  Parameters<typeof TamaguiProvider>[0]['config']
>;

export function AppProviders({ children }: PropsWithChildren) {
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
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: suitTheme.colors.background,
        }}
      >
        <TamaguiProvider config={providerConfig} defaultTheme="dark">
          <PortalProvider>
            <ToastProvider>
              {children}
              <AppToastHost />
              <ToastViewport />
            </ToastProvider>
          </PortalProvider>
        </TamaguiProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
