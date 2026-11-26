'use client';

import { signInSchema, type SignInValues } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/nextjs';
import { useTranslation } from '@17suit/i18n/react';
import { AppButton, AppInput } from '@17suit/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AuthFormError } from '../../../components/AuthFormError';
import { AuthShell } from '../../../components/AuthShell';
import {
  getClerkErrorField,
  getClerkErrorMessage,
  isAlreadySignedInError,
  type AuthErrorField,
} from '../../../lib/clerk-errors';
import { authFieldError } from '../../../lib/auth-validation';
import { afterAuthPath } from '../../../lib/session-handoff';

const ERROR_ID = 'sign-in-error';

// Only forward `redirect_url` when there is a real destination; '/' is the default.
function withRedirect(path: string, target: string): string {
  return target === '/' ? path : `${path}?redirect_url=${encodeURIComponent(target)}`;
}

export function SignInClient({ redirectTarget }: { redirectTarget: string }) {
  const { t } = useTranslation('landing');
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { control, handleSubmit, formState } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<AuthErrorField>(null);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const fail = (err: unknown, fallback: string) => {
    setError(getClerkErrorMessage(err, fallback, t));
    setErrorField(getClerkErrorField(err));
  };
  const fieldProps = (field: Exclude<AuthErrorField, null>) =>
    (error && errorField === field) || formState.errors[field as keyof SignInValues]
      ? { error: true, 'aria-describedby': ERROR_ID }
      : {};

  const isSubmitting = formState.isSubmitting;
  const firstFieldError =
    authFieldError(t, formState.errors.email?.message) ??
    authFieldError(t, formState.errors.password?.message) ??
    null;

  const handlePasswordSignIn = handleSubmit(async (values) => {
    if (!isLoaded) return;

    setError(null);
    setErrorField(null);

    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(afterAuthPath(redirectTarget));
        return;
      }

      setError(t('account.signIn.incomplete'));
      setErrorField(null);
    } catch (err) {
      if (isAlreadySignedInError(err)) {
        router.replace(afterAuthPath(redirectTarget));
        return;
      }
      fail(err, t('account.signIn.generic'));
    }
  });

  const onGoogleSSO = async () => {
    if (!isLoaded || isGooglePending) return;

    setIsGooglePending(true);
    setError(null);
    setErrorField(null);

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `/sso-callback?redirect_url=${encodeURIComponent(redirectTarget)}`,
        redirectUrlComplete: afterAuthPath(redirectTarget),
      });
    } catch (err) {
      // Session already active: skip SSO and continue to the product home.
      if (isAlreadySignedInError(err)) {
        router.replace(afterAuthPath(redirectTarget));
        return;
      }
      fail(err, t('account.signIn.generic'));
      // The redirect only happens on success, so the button is re-enabled on failure.
      setIsGooglePending(false);
    }
  };

  return (
    <AuthShell title={t('account.signIn.title')} description={t('account.signIn.description')}>
      <div className="mx-auto grid w-full max-w-form gap-sm">
        <button
          type="button"
          onClick={onGoogleSSO}
          disabled={!isLoaded || isGooglePending || isSubmitting}
          aria-busy={isGooglePending}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-sm rounded-[var(--radius-control)] border border-line bg-surface px-md text-md font-bold leading-[1.3] text-text transition-[border-color,box-shadow] duration-200 hover:border-[color-mix(in_oklab,var(--color-text)_36%,transparent)] hover:shadow-panel disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-line disabled:hover:shadow-none"
        >
          <GoogleMark />
          {isGooglePending ? t('account.signIn.googleOpening') : t('account.signIn.google')}
        </button>

        <p className="m-0 flex items-center gap-sm text-sm leading-[18px] text-muted before:h-px before:flex-1 before:bg-line before:content-[''] after:h-px after:flex-1 after:bg-line after:content-['']">
          {t('account.signIn.or')}
        </p>

        <form
          method="post"
          className="grid gap-sm"
          noValidate
          onSubmit={(event) => void handlePasswordSignIn(event)}
        >
          <Controller
            control={control}
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
                {...fieldProps('email')}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <AppInput
                type="password"
                name="password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                label={t('account.signIn.password')}
                placeholder={t('account.signIn.passwordPlaceholder')}
                autoComplete="current-password"
                required
                {...fieldProps('password')}
              />
            )}
          />
          <AppButton type="submit" compact disabled={isSubmitting || isGooglePending}>
            {isSubmitting ? t('account.signIn.submitting') : t('account.signIn.submit')}
          </AppButton>
          <div id="clerk-captcha" />
          <AuthFormError id={ERROR_ID} message={firstFieldError ?? error} />
        </form>

        <div className="flex flex-wrap justify-between gap-x-md">
          <Link
            href={withRedirect('/sign-up', redirectTarget)}
            className="inline-flex min-h-11 items-center font-bold text-text underline underline-offset-4"
          >
            {t('account.signIn.createAccount')}
          </Link>
          <Link
            href={withRedirect('/forgot-password', redirectTarget)}
            className="inline-flex min-h-11 items-center font-bold text-text underline underline-offset-4"
          >
            {t('account.signIn.forgot')}
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
