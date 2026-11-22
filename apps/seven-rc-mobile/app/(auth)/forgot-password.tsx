import { useSignIn } from '@clerk/clerk-expo';
import { AppButton, AppLinkAction, GapView } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FormError, FormField } from '../../components/form-field';
import { Screen } from '../../components/screen';
import { humanizeClerkError } from '../../lib/error-messages';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const required = (value: string, message: string) =>
    submitAttempted && value.trim().length === 0 ? message : null;
  const confirmError =
    required(confirmNewPassword, 'Repite la nueva contraseña.') ??
    (submitAttempted && newPassword !== confirmNewPassword
      ? 'Las contraseñas no coinciden.'
      : null);

  const sendResetCode = async () => {
    if (!isLoaded) return;
    setSubmitAttempted(true);
    setFormError(null);
    if (email.trim().length === 0) return;
    setIsSubmitting(true);
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email.trim() });
      setSubmitAttempted(false);
      setStep('reset');
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos enviar el código. Inténtalo de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async () => {
    if (!isLoaded) return;
    setSubmitAttempted(true);
    setFormError(null);
    if (
      code.trim().length === 0 ||
      newPassword.trim().length === 0 ||
      confirmNewPassword.trim().length === 0 ||
      newPassword !== confirmNewPassword
    ) {
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

      setFormError('No pudimos completar el cambio de contraseña. Inténtalo de nuevo.');
    } catch (err) {
      setFormError(
        humanizeClerkError(err, 'No pudimos cambiar la contraseña. Inténtalo de nuevo.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen
      back={false}
      title="Recuperar contraseña"
      subtitle={
        step === 'request'
          ? 'Te enviaremos un código a tu correo.'
          : `Escribe el código que enviamos a ${email.trim()} y tu nueva contraseña.`
      }
    >
      <GapView gap="sm">
        {step === 'request' ? (
          <>
            <FormField
              label="Correo"
              kind="email"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@correo.com"
              error={required(email, 'Ingresa tu correo.')}
              returnKeyType="send"
              onSubmitEditing={() => {
                void sendResetCode();
              }}
            />
            <FormError message={formError} />
            <AppButton onPress={sendResetCode} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando…' : 'Enviar código'}
            </AppButton>
          </>
        ) : (
          <>
            <FormField
              label="Código de verificación"
              kind="code"
              value={code}
              onChangeText={setCode}
              error={required(code, 'Ingresa el código.')}
            />
            <FormField
              label="Nueva contraseña"
              kind="new-password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Mínimo 8 caracteres"
              error={required(newPassword, 'Crea una nueva contraseña.')}
            />
            <FormField
              label="Repetir nueva contraseña"
              kind="new-password"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              error={confirmError}
              returnKeyType="go"
              onSubmitEditing={() => {
                void resetPassword();
              }}
            />
            <FormError message={formError} />
            <AppButton onPress={resetPassword} disabled={isSubmitting}>
              {isSubmitting ? 'Actualizando…' : 'Cambiar contraseña'}
            </AppButton>
          </>
        )}

        <AppLinkAction onPress={() => router.back()}>Volver a iniciar sesión</AppLinkAction>
      </GapView>
    </Screen>
  );
}
