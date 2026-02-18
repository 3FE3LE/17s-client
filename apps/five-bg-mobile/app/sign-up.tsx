import { useSignUp } from '@clerk/clerk-expo';
import { AppButton, AppFrame, AppInput, AppLinkAction, suitTheme } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { YStack } from 'tamagui';
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
  return 'No fue posible crear la cuenta.';
}

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      Alert.alert('Registro', 'Las contrasenas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        return;
      }

      Alert.alert('Registro', 'Tu cuenta requiere un paso adicional para completarse.');
    } catch (err) {
      Alert.alert('Registro', getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppFrame appName="Five Barber Go" subtitle="Crea tu cuenta con email y password.">
      <YStack style={{ gap: suitTheme.spacing.sm }}>
        <AppInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@company.com"
        />
        <AppInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
        />
        <AppInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirmar password"
        />
        <AppButton onPress={handleSignUp}>{isSubmitting ? 'Creando...' : 'Crear cuenta'}</AppButton>
        <AppLinkAction onPress={() => router.push('/sign-in')}>Ya tengo cuenta</AppLinkAction>
      </YStack>
    </AppFrame>
  );
}
