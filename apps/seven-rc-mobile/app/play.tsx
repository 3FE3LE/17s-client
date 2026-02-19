import { AppFrame, AppButton, YStack } from '@17suit/ui';
import { Alert } from 'react-native';

export default function PlayScreen() {
  return (
    <AppFrame appName="Player Dashboard" subtitle="Panel inicial para jugadores">
      <YStack style={{ gap: 10 }}>
        <AppButton onPress={() => Alert.alert('Player', 'Buscar complejo (pendiente)')}>
          Buscar complejo
        </AppButton>
        <AppButton onPress={() => Alert.alert('Player', 'Reservar (pendiente)')}>
          Reservar
        </AppButton>
      </YStack>
    </AppFrame>
  );
}
