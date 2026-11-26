'use client';

import {
  emailOnlySchema,
  resetPasswordSchema,
  type EmailOnlyValues,
  type ResetPasswordValues,
} from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/nextjs';
import { useTranslation } from '@17suit/i18n/react';
import { AppButton, AppInput } from '@17suit/ui';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AuthFormError } from '../../components/AuthFormError';
import { AuthShell } from '../../components/AuthShell';
import { resolveRedirectTarget } from '../../lib/auth-redirect';
import { afterAuthPath } from '../../lib/session-handoff';
import { authFieldError } from '../../lib/auth-validation';
import { getClerkErrorMessage } from '../../lib/clerk-errors';

function ForgotPasswordPageContent() {
  const { t } = useTranslation('landing');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();
  const requestForm = useForm<EmailOnlyValues>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: '' },
  });
  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: '', password: '', confirmPassword: '' },
  });
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [error, setError] = useState<string | null>(null);

  const redirectTarget = useMemo(() => {
    return resolveRedirectTarget(searchParams.get('redirect_url'));
  }, [searchParams]);

  const requestErrors = requestForm.formState.errors;
  const resetErrors = resetForm.formState.errors;
  const requestFieldError = authFieldError(t, requestErrors.email?.message);
  const resetFieldError =
    authFieldError(t, resetErrors.code?.message) ??
    authFieldError(t, resetErrors.password?.message) ??
    authFieldError(t, resetErrors.confirmPassword?.message);
  const isSubmitting = requestForm.formState.isSubmitting || resetForm.formState.isSubmitting;

  const sendResetCode = requestForm.handleSubmit(async (values) => {
    if (!isLoaded) return;
    setError(null);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: values.email,
      });
      setStep('reset');
    } catch (err) {
      setError(getClerkErrorMessage(err, t('account.forgot.generic'), t));
    }
  });

  const resetPassword = resetForm.handleSubmit(async (values) => {
    if (!isLoaded) return;
    setError(null);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: values.code,
        password: values.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(afterAuthPath(redirectTarget));
        return;
      }

      setError(t('account.forgot.resetFailed'));
    } catch (err) {
      setError(getClerkErrorMessage(err, t('account.forgot.generic'), t));
    }
  });

  return (
    <AuthShell title={t('account.forgot.title')} description={t('account.forgot.description')}>
      <div className="mx-auto grid w-full max-w-form gap-sm">
        {step === 'request' ? (
          <form
            method="post"
            className="grid gap-sm"
            noValidate
            onSubmit={(event) => void sendResetCode(event)}
          >
            <Controller
              control={requestForm.control}
              name="email"
              render={({ field }) => (
                <AppInput
                  type="email"
                  name="email"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  label={t('account.signIn.email')}
                  placeholder={t('account.signIn.emailPlaceholder')}
                  autoComplete="email"
                  spellCheck={false}
                  required
                  error={Boolean(error ?? requestErrors.email)}
                />
              )}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? t('account.forgot.sending') : t('account.forgot.sendCode')}
            </AppButton>
            <div id="clerk-captcha" />
            <AuthFormError message={requestFieldError ?? error} />
          </form>
        ) : (
          <form
            method="post"
            className="grid gap-sm"
            noValidate
            onSubmit={(event) => void resetPassword(event)}
          >
            <Controller
              control={resetForm.control}
              name="code"
              render={({ field }) => (
                <AppInput
                  type="text"
                  name="code"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  label={t('account.signUp.code')}
                  placeholder="123456"
                  autoComplete="one-time-code"
                  spellCheck={false}
                  required
                  error={Boolean(error ?? resetErrors.code)}
                />
              )}
            />
            <Controller
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <AppInput
                  type="password"
                  name="newPassword"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  label={t('account.forgot.newPassword')}
                  placeholder={t('account.forgot.newPassword')}
                  autoComplete="new-password"
                  required
                  error={Boolean(error ?? resetErrors.password)}
                />
              )}
            />
            <Controller
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <AppInput
                  type="password"
                  name="confirmNewPassword"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  label={t('account.forgot.confirmNewPassword')}
                  placeholder={t('account.forgot.repeatPassword')}
                  autoComplete="new-password"
                  required
                  error={Boolean(error ?? resetErrors.confirmPassword)}
                />
              )}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? t('account.forgot.updating') : t('account.forgot.update')}
            </AppButton>
            <AuthFormError message={resetFieldError ?? error} />
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
