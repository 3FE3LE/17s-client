import { useSignUp } from '@clerk/clerk-expo';
import { AppButton, AppFrame, AppInput, AppLinkAction, GapView, useAppTheme } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { Alert, Text } from 'react-native';
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
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const passwordsMatch = password === confirmPassword;
  const isFormValid =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    passwordsMatch;

  const handleCreateAccount = async () => {
    if (!isLoaded) return;
    setSubmitAttempted(true);
    if (!isFormValid) {
      if (!passwordsMatch) {
        Alert.alert('Registro', 'Las contrasenas no coinciden.');
      }
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

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.push('/sign-up-verify');
    } catch (err) {
      Alert.alert('Registro', getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppFrame appName="Seven Reservations Club" subtitle="Crea tu cuenta con email y password.">
      <GapView gap="sm">
        <AppInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@company.com"
        />
        {submitAttempted && email.trim().length === 0 ? (
          <Text style={{ color: theme.colors.error, fontSize: 12 }}>Ingresa tu email.</Text>
        ) : null}
        <AppInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
        />
        {submitAttempted && password.trim().length === 0 ? (
          <Text style={{ color: theme.colors.error, fontSize: 12 }}>Ingresa tu password.</Text>
        ) : null}
        <AppInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirmar password"
        />
        {submitAttempted && confirmPassword.trim().length === 0 ? (
          <Text style={{ color: theme.colors.error, fontSize: 12 }}>Confirma tu password.</Text>
        ) : null}
        {submitAttempted && !passwordsMatch ? (
          <Text style={{ color: theme.colors.error, fontSize: 12 }}>
            Las contrasenas no coinciden.
          </Text>
        ) : null}
        <AppButton onPress={handleCreateAccount} disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear cuenta'}
        </AppButton>
        <AppLinkAction onPress={() => router.push('/sign-in')}>Ya tengo cuenta</AppLinkAction>
      </GapView>
    </AppFrame>
  );
}
