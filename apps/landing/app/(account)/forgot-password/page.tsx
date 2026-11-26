'use client';

import { useSignIn } from '@clerk/nextjs';
import { useTranslation } from '@17suit/i18n/react';
import { AppButton, AppInput } from '@17suit/ui';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, type FormEvent } from 'react';
import { AuthFormError } from '../../components/AuthFormError';
import { AuthShell } from '../../components/AuthShell';
import { resolveRedirectTarget } from '../../lib/auth-redirect';
import { afterAuthPath } from '../../lib/session-handoff';
import { getClerkErrorMessage } from '../../lib/clerk-errors';

function ForgotPasswordPageContent() {
  const { t } = useTranslation('landing');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(() => {
    return resolveRedirectTarget(searchParams.get('redirect_url'));
  }, [searchParams]);

  const sendResetCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setStep('reset');
    } catch (err) {
      setError(getClerkErrorMessage(err, t('account.forgot.generic'), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;
    if (newPassword !== confirmNewPassword) {
      setError(t('account.errors.mismatch'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password: newPassword,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(afterAuthPath(redirectTarget));
        return;
      }

      setError(t('account.forgot.resetFailed'));
    } catch (err) {
      setError(getClerkErrorMessage(err, t('account.forgot.generic'), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell title={t('account.forgot.title')} description={t('account.forgot.description')}>
      <div className="mx-auto grid w-full max-w-form gap-sm">
        {step === 'request' ? (
          <form method="post" className="grid gap-sm" onSubmit={sendResetCode}>
            <AppInput
              type="email"
              name="email"
              value={email}
              onChangeText={setEmail}
              label={t('account.signIn.email')}
              placeholder={t('account.signIn.emailPlaceholder')}
              autoComplete="email"
              spellCheck={false}
              required
              error={Boolean(error)}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? t('account.forgot.sending') : t('account.forgot.sendCode')}
            </AppButton>
            <div id="clerk-captcha" />
            <AuthFormError message={error} />
          </form>
        ) : (
          <form method="post" className="grid gap-sm" onSubmit={resetPassword}>
            <AppInput
              type="text"
              name="code"
              value={code}
              onChangeText={setCode}
              label={t('account.signUp.code')}
              placeholder="123456"
              autoComplete="one-time-code"
              spellCheck={false}
              required
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              name="newPassword"
              value={newPassword}
              onChangeText={setNewPassword}
              label={t('account.forgot.newPassword')}
              placeholder={t('account.forgot.newPassword')}
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              label={t('account.forgot.confirmNewPassword')}
              placeholder={t('account.forgot.repeatPassword')}
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? t('account.forgot.updating') : t('account.forgot.update')}
            </AppButton>
            <AuthFormError message={error} />
          </form>
        )}

        <Link
          href={`/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`}
          className="inline-flex min-h-11 w-fit items-center font-bold text-text underline underline-offset-4"
        >
          {t('account.forgot.backToSignIn')}
        </Link>
      </div>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}
