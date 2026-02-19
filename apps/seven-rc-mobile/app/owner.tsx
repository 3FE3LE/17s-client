import { AppFrame, AppButton, YStack } from '@17suit/ui';
import { Alert } from 'react-native';

export default function OwnerScreen() {
  return (
    <AppFrame appName="Owner Dashboard" subtitle="Panel inicial para duenos de complejo">
      <YStack style={{ gap: 10 }}>
        <AppButton onPress={() => Alert.alert('Owner', 'Crear complejo (pendiente)')}>
          Crear complejo
        </AppButton>
        <AppButton onPress={() => Alert.alert('Owner', 'Crear cancha (pendiente)')}>
          Crear cancha
        </AppButton>
        <AppButton onPress={() => Alert.alert('Owner', 'Reservas pendientes (pendiente)')}>
          Reservas pendientes
        </AppButton>
      </YStack>
    </AppFrame>
  );
}
