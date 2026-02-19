import { defaultConfig } from '@tamagui/config/v5';
import { createTamagui } from 'tamagui';

export const tamaguiConfig: ReturnType<typeof createTamagui> = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    styleCompat: 'react-native',
  },
});

type AppTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  // Required by Tamagui module augmentation pattern.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default tamaguiConfig;
