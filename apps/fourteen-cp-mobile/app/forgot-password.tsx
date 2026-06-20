import { useSignIn } from '@clerk/clerk-expo';
import { AppButton, AppFrame, AppInput, AppLinkAction, suitTheme, GapView } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
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
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendResetCode = async () => {
    if (!isLoaded) return;
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
    <AppFrame appName="Fourteen Cash Pulse" subtitle="Recupera tu contrasena con codigo por email.">
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
            <AppButton onPress={sendResetCode}>
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
            <AppInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Nueva password"
            />
            <AppInput
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry
              placeholder="Confirmar nueva password"
            />
            <AppButton onPress={resetPassword}>
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
