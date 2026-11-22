import { useSignUp } from '@clerk/clerk-expo';
import { AppButton, AppFrame, AppLinkAction, GapView } from '@17suit/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FormError, FormField } from '../../components/form-field';
import { humanizeClerkError } from '../../lib/error-messages';

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = submitAttempted && email.trim().length === 0 ? 'Ingresa tu correo.' : null;
  const passwordError =
    submitAttempted && password.trim().length === 0 ? 'Crea una contraseña.' : null;
  const confirmError = !submitAttempted
    ? null
    : confirmPassword.trim().length === 0
      ? 'Repite la contraseña.'
      : password !== confirmPassword
        ? 'Las contraseñas no coinciden.'
        : null;

  const handleCreateAccount = async () => {
    if (!isLoaded) return;
    setSubmitAttempted(true);
    setFormError(null);
    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      confirmPassword.trim().length === 0 ||
      password !== confirmPassword
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUp.create({ emailAddress: email.trim(), password });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.push('/sign-up-verify');
    } catch (err) {
      setFormError(humanizeClerkError(err, 'No pudimos crear la cuenta. Inténtalo de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppFrame appName="Crear cuenta" subtitle="Te enviaremos un código para verificar tu correo.">
      <GapView gap="sm">
        <FormField
          label="Correo"
          kind="email"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@correo.com"
          error={emailError}
          returnKeyType="next"
        />
        <FormField
          label="Contraseña"
          kind="new-password"
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 8 caracteres"
          error={passwordError}
          returnKeyType="next"
        />
        <FormField
          label="Repetir contraseña"
          kind="new-password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={confirmError}
          returnKeyType="go"
          onSubmitEditing={() => {
            void handleCreateAccount();
          }}
        />
        <FormError message={formError} />
        <AppButton onPress={handleCreateAccount} disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </AppButton>
        <AppLinkAction onPress={() => router.push('/sign-in')}>Ya tengo una cuenta</AppLinkAction>
      </GapView>
    </AppFrame>
  );
}
