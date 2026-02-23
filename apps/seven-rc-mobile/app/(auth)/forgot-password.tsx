import { useSignIn } from '@clerk/clerk-expo';
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
  return 'No fue posible restablecer la contrasena.';
}

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const sendResetCode = async () => {
    if (!isLoaded) return;
    setSubmitAttempted(true);
    if (email.trim().length === 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setStep('reset');
    } catch (err) {
      Alert.alert('Recuperar password', getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async () => {
    if (!isLoaded) return;
    setSubmitAttempted(true);
    const isResetValid =
      code.trim().length > 0 &&
      newPassword.trim().length > 0 &&
      confirmNewPassword.trim().length > 0;
    if (!isResetValid) {
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Recuperar password', 'Las contrasenas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password: newPassword,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        router.replace('/');
        return;
      }

      Alert.alert('Recuperar password', 'No se pudo completar el restablecimiento de contrasena.');
    } catch (err) {
      Alert.alert('Recuperar password', getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppFrame
      appName="Seven Reservations Club"
      subtitle="Recupera tu contrasena con codigo por email."
    >
      <GapView gap="sm">
        {step === 'request' ? (
          <>
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
            <AppButton onPress={sendResetCode} disabled={email.trim().length === 0 || isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar codigo'}
            </AppButton>
          </>
        ) : (
          <>
            <AppInput
              value={code}
              onChangeText={setCode}
              autoCapitalize="none"
              placeholder="Codigo de verificacion"
              compact
            />
            {submitAttempted && code.trim().length === 0 ? (
              <Text style={{ color: theme.colors.error, fontSize: 12 }}>Ingresa el codigo.</Text>
            ) : null}
            <AppInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Nueva password"
            />
            {submitAttempted && newPassword.trim().length === 0 ? (
              <Text style={{ color: theme.colors.error, fontSize: 12 }}>
                Ingresa la nueva password.
              </Text>
            ) : null}
            <AppInput
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry
              placeholder="Confirmar nueva password"
            />
            {submitAttempted && confirmNewPassword.trim().length === 0 ? (
              <Text style={{ color: theme.colors.error, fontSize: 12 }}>
                Confirma la nueva password.
              </Text>
            ) : null}
            {submitAttempted && newPassword !== confirmNewPassword ? (
              <Text style={{ color: theme.colors.error, fontSize: 12 }}>
                Las contrasenas no coinciden.
              </Text>
            ) : null}
            <AppButton
              onPress={resetPassword}
              disabled={
                code.trim().length === 0 ||
                newPassword.trim().length === 0 ||
                confirmNewPassword.trim().length === 0 ||
                newPassword !== confirmNewPassword ||
                isSubmitting
              }
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar password'}
            </AppButton>
          </>
        )}

        <AppLinkAction onPress={() => router.push('/sign-in')}>
          Volver a iniciar sesion
        </AppLinkAction>
      </GapView>
    </AppFrame>
  );
}
