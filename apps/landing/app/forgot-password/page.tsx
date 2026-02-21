'use client';

import { useSignIn } from '@clerk/nextjs';
import { AppButton, AppFrame, AppInput, AppLinkAction, suitTheme } from '@17suit/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

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
  return 'Unable to reset password.';
}

function resolveRedirectTarget(rawValue: string | null): string {
  if (!rawValue || rawValue.trim().length === 0) {
    return '/';
  }
  if (rawValue.startsWith('/')) {
    return rawValue;
  }
  if (rawValue.startsWith('http://') || rawValue.startsWith('https://')) {
    return rawValue;
  }
  return '/';
}

export default function ForgotPasswordPage() {
  const bodyType = suitTheme.typography.styles.body;
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

  const sendResetCode = async () => {
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
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async () => {
    if (!isLoaded) return;
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
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
        router.replace(redirectTarget);
        return;
      }

      setError('Could not complete password reset.');
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppFrame appName="17Suit" subtitle="Reset your password for all 17Suit products.">
      <div
        style={{
          width: '100%',
          maxWidth: suitTheme.sizes.layout.form,
          display: 'grid',
          gap: suitTheme.spacing.md,
        }}
      >
        {step === 'request' ? (
          <div style={{ display: 'grid', gap: suitTheme.spacing.sm }}>
            <AppInput
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              autoComplete="email"
              required
              error={Boolean(error)}
            />
            <AppButton onPress={sendResetCode}>
              {isSubmitting ? 'Sending...' : 'Send code'}
            </AppButton>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: suitTheme.spacing.sm }}>
            <AppInput
              type="text"
              value={code}
              onChangeText={setCode}
              placeholder="Verification code"
              autoComplete="one-time-code"
              required
              compact
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New password"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppInput
              type="password"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
              error={Boolean(error)}
            />
            <AppButton onPress={resetPassword}>
              {isSubmitting ? 'Updating...' : 'Update password'}
            </AppButton>
          </div>
        )}

        <AppLinkAction
          onPress={() => router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`)}
        >
          Back to sign in
        </AppLinkAction>

        {error ? (
          <p
            style={{
              margin: 0,
              color: suitTheme.colors.destructive,
              fontFamily: bodyType.webFamily,
              fontSize: bodyType.fontSize,
              lineHeight: `${bodyType.lineHeightRecommended}`,
              fontWeight: bodyType.fontWeight,
              letterSpacing: bodyType.letterSpacingEm,
            }}
          >
            {error}
          </p>
        ) : null}
      </div>
    </AppFrame>
  );
}
