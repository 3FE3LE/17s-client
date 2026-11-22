import { useSignUp } from '@clerk/clerk-expo';
import { AppButton, AppFrame, AppLinkAction, GapView, useAppToast } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FormError, FormField } from '../../components/form-field';
import { humanizeClerkError } from '../../lib/error-messages';

export default function SignUpVerifyScreen() {
  const router = useRouter();
  const toast = useAppToast();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const codeError =
    submitAttempted && code.trim().length === 0 ? 'Ingresa el código de verificación.' : null;

  const handleVerifyEmail = async () => {
    if (!isLoaded) return;
    setSubmitAttempted(true);
    setFormError(null);
    if (code.trim().length === 0) return;

    setIsSubmitting(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        router.replace('/');
        return;
      }

      setFormError('No pudimos completar la verificación. Inténtalo de nuevo.');
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos verificar tu correo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;
    setFormError(null);
    setIsSubmitting(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      toast.success('Código enviado', 'Revisa tu correo, también la carpeta de spam.');
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos reenviar el código.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppFrame
      appName="Verifica tu correo"
      subtitle="Escribe el código de verificación que te enviamos por correo."
    >
      <GapView gap="sm">
        <FormField
          label="Código de verificación"
          kind="code"
          value={code}
          onChangeText={setCode}
          error={codeError}
          returnKeyType="go"
          onSubmitEditing={() => {
            void handleVerifyEmail();
          }}
        />
        <FormError message={formError} />
        <AppButton onPress={handleVerifyEmail} disabled={isSubmitting}>
          {isSubmitting ? 'Verificando…' : 'Verificar correo'}
        </AppButton>
        <AppButton variant="neutral" onPress={handleResendCode} disabled={isSubmitting}>
          Reenviar código
        </AppButton>
        <AppLinkAction onPress={() => router.back()}>Cambiar correo</AppLinkAction>
      </GapView>
    </AppFrame>
  );
}
