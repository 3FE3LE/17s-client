'use client';

import { useSignIn } from '@clerk/nextjs';
import { AppButton, AppDivider, AppFrame, AppInput, AppLinkAction, suitTheme } from '@17suit/ui';
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
  return 'Sign in failed.';
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

export default function SignInPage() {
  const bodyType = suitTheme.typography.styles.body;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(() => {
    return resolveRedirectTarget(searchParams.get('redirect_url'));
  }, [searchParams]);

  const handlePasswordSignIn = async () => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(redirectTarget);
        return;
      }

      setError('Your session needs an additional step to complete.');
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onGoogleSSO = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: redirectTarget,
      });
    } catch (err) {
      setError(getClerkErrorMessage(err));
    }
  };

  return (
    <AppFrame appName="17Suit" subtitle="Sign in once and continue to any 17Suit product.">
      <div
        style={{
          width: '100%',
          maxWidth: suitTheme.sizes.layout.form,
          display: 'grid',
          gap: suitTheme.spacing.md,
        }}
      >
        <AppButton variant="neutral" onPress={onGoogleSSO}>
          Continue with Google
        </AppButton>

        <AppDivider />

        <div style={{ display: 'grid', gap: suitTheme.spacing.sm }}>
          <AppInput
            type="email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
          <AppInput
            type="password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <AppButton onPress={handlePasswordSignIn}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </AppButton>
        </div>

        <div style={{ display: 'flex', gap: suitTheme.spacing.md, flexWrap: 'wrap' }}>
          <AppLinkAction
            onPress={() =>
              router.push(`/sign-up?redirect_url=${encodeURIComponent(redirectTarget)}`)
            }
          >
            Create account
          </AppLinkAction>
          <AppLinkAction
            onPress={() =>
              router.push(`/forgot-password?redirect_url=${encodeURIComponent(redirectTarget)}`)
            }
          >
            Forgot password
          </AppLinkAction>
        </div>

        <AppLinkAction onPress={() => router.replace('/')}>Back to landing</AppLinkAction>

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
