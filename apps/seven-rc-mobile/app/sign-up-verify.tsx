import { useSignUp } from '@clerk/clerk-expo';
import { AppButton, AppFrame, AppInput, AppLinkAction, YStack, suitTheme } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useState } from 'react';

function getClerkErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const errors = (
      error as { errors?: Array<{ code?: string; message?: string; longMessage?: string }> }
    ).errors;
    if (errors && errors.length > 0) {
      const first = errors[0];
      if (first?.longMessage) return first.longMessage;
      if (first?.message) return first.message;
      if (first?.code) return first.code;
    }
  }
  return 'No fue posible verificar tu email.';
}

export default function SignUpVerifyScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyEmail = async () => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        return;
      }

      Alert.alert('Registro', 'No se pudo completar la verificacion. Intenta nuevamente.');
    } catch (err) {
      Alert.alert('Registro', getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      Alert.alert('Registro', 'Enviamos un nuevo codigo a tu email.');
    } catch (err) {
      Alert.alert('Registro', getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppFrame
      appName="Seven Reservations Club"
      subtitle="Ingresa el codigo de verificacion que recibiste por email."
    >
      <YStack style={{ gap: suitTheme.spacing.sm }}>
        <AppInput
          value={code}
          onChangeText={setCode}
          autoCapitalize="none"
          keyboardType="number-pad"
          placeholder="Codigo de verificacion"
          compact
        />
        <AppButton onPress={handleVerifyEmail}>
          {isSubmitting ? 'Verificando...' : 'Verificar email'}
        </AppButton>
        <AppButton variant="neutral" onPress={handleResendCode}>
          Reenviar codigo
        </AppButton>
        <AppLinkAction onPress={() => router.replace('/sign-up')}>
          Volver a crear cuenta
        </AppLinkAction>
      </YStack>
    </AppFrame>
  );
}
