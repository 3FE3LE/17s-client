import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '../../__tests__/renderHook';
import { useRouteRoleSplash } from '../useRouteRoleSplash';

const replace = vi.fn();

beforeEach(() => {
  replace.mockReset();
});

afterEach(() => {
  replace.mockReset();
});

const baseArgs = {
  roleOnboardingPath: '/onboarding/role',
  signedOutPath: '/sign-in',
  resolveHomePath: (role: 'owner' | 'play') => (role === 'owner' ? '/owner/home' : '/play/home'),
} as const;

describe('useRouteRoleSplash', () => {
  it('does nothing while Clerk is still loading', () => {
    renderHook(() =>
      useRouteRoleSplash<'owner'>({
        ...baseArgs,
        router: { replace },
        isLoading: false,
        isSignedIn: false,
        isAuthLoaded: false,
        role: null,
        error: null,
      }),
    );
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects to signedOutPath when the user is not signed in', () => {
    renderHook(() =>
      useRouteRoleSplash<'owner'>({
        ...baseArgs,
        router: { replace },
        isLoading: false,
        isSignedIn: false,
        isAuthLoaded: true,
        role: null,
        error: null,
      }),
    );
    expect(replace).toHaveBeenCalledWith('/sign-in');
  });

  it('redirects to roleOnboardingPath when an error is reported', () => {
    renderHook(() =>
      useRouteRoleSplash<'owner'>({
        ...baseArgs,
        router: { replace },
        isLoading: false,
        isSignedIn: true,
        isAuthLoaded: true,
        role: null,
        error: new Error('boom'),
      }),
    );
    expect(replace).toHaveBeenCalledWith('/onboarding/role');
  });

  it('does nothing while the role is still loading after Clerk loaded', () => {
    renderHook(() =>
      useRouteRoleSplash<'owner'>({
        ...baseArgs,
        router: { replace },
        isLoading: true,
        isSignedIn: true,
        isAuthLoaded: true,
        role: null,
        error: null,
      }),
    );
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects to roleOnboardingPath when the signed-in user has no role', () => {
    renderHook(() =>
      useRouteRoleSplash<'owner'>({
        ...baseArgs,
        router: { replace },
        isLoading: false,
        isSignedIn: true,
        isAuthLoaded: true,
        role: null,
        error: null,
      }),
    );
    expect(replace).toHaveBeenCalledWith('/onboarding/role');
  });

  it('redirects to the resolved home path when the role is set', () => {
    renderHook(() =>
      useRouteRoleSplash<'owner' | 'play'>({
        ...baseArgs,
        router: { replace },
        isLoading: false,
        isSignedIn: true,
        isAuthLoaded: true,
        role: 'play',
        error: null,
      }),
    );
    expect(replace).toHaveBeenCalledWith('/play/home');
  });

  it('does nothing when ready is false even if everything else resolves', () => {
    renderHook(() =>
      useRouteRoleSplash<'owner'>({
        ...baseArgs,
        router: { replace },
        isLoading: false,
        isSignedIn: false,
        isAuthLoaded: true,
        role: null,
        error: null,
        ready: false,
      }),
    );
    expect(replace).not.toHaveBeenCalled();
  });
});
