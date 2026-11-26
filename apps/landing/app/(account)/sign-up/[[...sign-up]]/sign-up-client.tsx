'use client';

import {
  signUpSchema,
  verifyCodeSchema,
  type SignUpValues,
  type VerifyCodeValues,
} from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@clerk/nextjs';
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
import { useUiLocale } from '../../../components/use-ui-locale';
import { localePath } from '../../../lib/locale-path';
import { authFieldError } from '../../../lib/auth-validation';
import { afterAuthPath } from '../../../lib/session-handoff';

const ERROR_ID = 'sign-up-error';
const PASSWORD_HINT_ID = 'sign-up-password-hint';

type SignUpErrorField = AuthErrorField | 'confirmPassword';

interface SignUpClientProps {
  redirectTarget: string;
  productContext?: { accentKey: string; name: string } | undefined;
}

export function SignUpClient({ redirectTarget, productContext }: SignUpClientProps) {
  const { t } = useTranslation('landing');
  const locale = useUiLocale();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });
  const verifyForm = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: '' },
  });
  const email = signUpForm.watch('email');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<SignUpErrorField>(null);
  const [isResending, setIsResending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
    setErrorField(null);
  };
  const fail = (err: unknown, fallback: string) => {
    setError(getClerkErrorMessage(err, fallback, t));
    setErrorField(getClerkErrorField(err));
  };
  const isInvalid = (field: Exclude<SignUpErrorField, null>) =>
    (Boolean(error) && errorField === field) ||
    (field !== 'code' && Boolean(signUpErrors[field])) ||
    (field === 'code' && Boolean(verifyForm.formState.errors.code));
  const describedBy = (field: Exclude<SignUpErrorField, null>, hintId?: string) =>
    [hintId, isInvalid(field) ? ERROR_ID : null].filter(Boolean).join(' ') || undefined;

  const signUpErrors = signUpForm.formState.errors;
  const isSubmitting = signUpForm.formState.isSubmitting || verifyForm.formState.isSubmitting;
  const mismatchText = authFieldError(t, signUpErrors.confirmPassword?.message);
  const signUpFieldError =
    authFieldError(t, signUpErrors.email?.message) ??
    authFieldError(t, signUpErrors.password?.message) ??
    null;
  const codeFieldError = authFieldError(t, verifyForm.formState.errors.code?.message) ?? null;

  const onGoogleSSO = async () => {
    if (!isLoaded || isGooglePending) return;

    setIsGooglePending(true);
    clearError();

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `/sso-callback?redirect_url=${encodeURIComponent(redirectTarget)}`,
        redirectUrlComplete: afterAuthPath(redirectTarget),
      });
    } catch (err) {
      // Session already active: skip SSO and continue to the target.
      if (isAlreadySignedInError(err)) {
        router.replace(afterAuthPath(redirectTarget));
        return;
      }
      fail(err, t('account.signUp.generic'));
      // The redirect only happens on success, so the button is re-enabled on failure.
      setIsGooglePending(false);
    }
  };

  const handleCreateAccount = signUpForm.handleSubmit(async (values) => {
    if (!isLoaded) return;

    clearError();

    try {
      const result = await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace(afterAuthPath(redirectTarget));
        return;
      }

      if (result.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setNeedsVerification(true);
        return;
      }

      setError(t('account.signUp.createFailed'));
    } catch (err) {
      if (isAlreadySignedInError(err)) {
        router.replace(afterAuthPath(redirectTarget));
        return;
      }
      fail(err, t('account.signUp.generic'));
    }
  });

  const handleVerifyEmail = verifyForm.handleSubmit(async (values) => {
    if (!isLoaded) return;

    clearError();
    setResendNotice(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: values.code });
      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace(afterAuthPath(redirectTarget));
        return;
      }

      setError(t('account.signUp.verifyFailed'));
      setErrorField('code');
    } catch (err) {
      fail(err, t('account.signUp.generic'));
    }
  });

  const handleResendCode = async () => {
    if (!isLoaded || isResending) return;

    setIsResending(true);
    clearError();
    setResendNotice(null);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      verifyForm.reset();
      setResendNotice(t('account.signUp.resent', { email: email.trim() }));
    } catch (err) {
      fail(err, t('account.signUp.resendFailed'));
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    setNeedsVerification(false);
    verifyForm.reset();
    setResendNotice(null);
    clearError();
  };

  return (
    <AuthShell
      title={t('account.signUp.title')}
      description={t('account.signUp.description')}
      context={
        productContext
          ? {
              accentKey: productContext.accentKey,
              text: t('account.signUp.forProduct', { name: productContext.name }),
            }
          : undefined
      }
    >
      <div className="mx-auto grid w-full max-w-form gap-sm">
        {!needsVerification ? (
          <>
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
          </>
        ) : null}

        {!needsVerification ? (
          <form
            method="post"
            className="grid gap-sm"
            noValidate
            onSubmit={(event) => void handleCreateAccount(event)}
          >
            <Controller
              control={signUpForm.control}
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
                  error={isInvalid('email')}
                  aria-describedby={describedBy('email')}
                />
              )}
            />
            <Controller
              control={signUpForm.control}
              name="password"
              render={({ field }) => (
                <AppInput
                  type="password"
                  name="password"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  label={t('account.signIn.password')}
                  placeholder={t('account.signUp.passwordPlaceholder')}
                  autoComplete="new-password"
                  required
                  error={isInvalid('password')}
                  aria-describedby={describedBy('password', PASSWORD_HINT_ID)}
                />
              )}
            />
            <p id={PASSWORD_HINT_ID} className="m-0 -mt-[4px] text-sm leading-[1.4] text-muted">
              {t('account.signUp.passwordHint')}
            </p>
            <Controller
              control={signUpForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <AppInput
                  type="password"
                  name="confirmPassword"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  label={t('account.signUp.confirm')}
                  placeholder={t('account.signUp.confirmPlaceholder')}
                  autoComplete="new-password"
                  required
                  error={isInvalid('confirmPassword')}
                  aria-describedby={describedBy('confirmPassword')}
                />
              )}
            />
            {/* Mismatch shows right under its field; other errors stay at the form end.
                The line is reserved: an error appearing on blur would move the control
                being tapped and swallow that tap. */}
            <div className="-my-[4px] min-h-[18px]">
              {mismatchText ? <AuthFormError id={ERROR_ID} message={mismatchText} /> : null}
            </div>
            <AppButton type="submit" compact disabled={isSubmitting || isGooglePending}>
              {isSubmitting ? t('account.signUp.submitting') : t('account.signUp.submit')}
            </AppButton>
            <p className="m-0 text-sm leading-[18px] text-muted">
              {/* TODO(legal): switch to "Al crear tu cuenta aceptas…" once the terms are final. */}
              {t('account.signUp.review')}{' '}
              <Link
                href={localePath(locale, '/terms')}
                className="font-bold text-text underline underline-offset-4"
              >
                {t('account.signUp.terms')}
              </Link>{' '}
              {t('account.signUp.and')}{' '}
              <Link
                href={localePath(locale, '/privacy')}
                className="font-bold text-text underline underline-offset-4"
              >
                {t('account.signUp.privacy')}
              </Link>
              .
            </p>
            <div id="clerk-captcha" />
            {mismatchText ? null : (
              <AuthFormError id={ERROR_ID} message={signUpFieldError ?? error} />
            )}
          </form>
        ) : (
          <div className="grid gap-sm">
            <h2 className="m-0 font-arvo text-lg font-bold leading-[1.25] text-text">
              {t('account.signUp.checkEmail')}
            </h2>
            <p className="m-0 text-md leading-[1.5] text-muted">
              {t('account.signUp.codeSent', { email: email.trim() })}
            </p>
          </div>
        )}

        {needsVerification ? (
          <form
            method="post"
            className="grid gap-sm"
            noValidate
            onSubmit={(event) => void handleVerifyEmail(event)}
          >
            <Controller
              control={verifyForm.control}
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
                  inputMode="numeric"
                  spellCheck={false}
                  required
                  error={isInvalid('code')}
                  aria-describedby={describedBy('code')}
                />
              )}
            />
            <AppButton type="submit" compact disabled={isSubmitting}>
              {isSubmitting ? t('account.signUp.verifying') : t('account.signUp.verify')}
            </AppButton>
            <AuthFormError id={ERROR_ID} message={codeFieldError ?? error} />
            <p
              aria-live="polite"
              className="m-0 min-h-0 text-sm leading-[18px] text-muted empty:hidden"
            >
              {resendNotice}
            </p>
            <div className="flex flex-wrap justify-between gap-x-md">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending || isSubmitting}
                className="inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 text-md font-bold text-text underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResending ? t('account.signUp.resending') : t('account.signUp.resend')}
              </button>
              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={isSubmitting}
                className="inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 text-md font-bold text-text underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t('account.signUp.changeEmail')}
              </button>
            </div>
          </form>
        ) : null}

        <Link
          href={`/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`}
          className="inline-flex min-h-11 w-fit items-center font-bold text-text underline underline-offset-4"
        >
          {t('account.signUp.haveAccount')}
        </Link>
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
