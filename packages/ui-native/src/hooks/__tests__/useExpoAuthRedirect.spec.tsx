import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '../../__tests__/renderHook';
import {
  __setPathnameForTests,
  __setRouterForTests,
  __resetRouterStubsForTests,
} from '../../__tests__/expo-router-stub';
import { __resetAuthForTests, __setAuthForTests } from '../../__tests__/clerk-stub';
import { useExpoAuthRedirect } from '../useExpoAuthRedirect';

const replace = vi.fn();

beforeEach(() => {
  replace.mockReset();
  __setRouterForTests({ replace });
});

afterEach(() => {
  __resetRouterStubsForTests();
  __resetAuthForTests();
});

describe('useExpoAuthRedirect', () => {
  it('does nothing while Clerk is loading', () => {
    __setAuthForTests({ isLoaded: false, isSignedIn: undefined });
    __setPathnameForTests('/home');
    renderHook(() => useExpoAuthRedirect());
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects signed-out users away from private paths', () => {
    __setAuthForTests({ isLoaded: true, isSignedIn: false });
    __setPathnameForTests('/home');
    renderHook(() => useExpoAuthRedirect({ publicPaths: ['/sign-in'] }));
    expect(replace).toHaveBeenCalledWith('/sign-in');
  });

  it('redirects signed-in users off a public path', () => {
    __setAuthForTests({ isLoaded: true, isSignedIn: true });
    __setPathnameForTests('/sign-in');
    renderHook(() =>
      useExpoAuthRedirect({
        publicPaths: ['/sign-in'],
        signedInPath: '/',
        signedOutPath: '/sign-in',
      }),
    );
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('does not redirect when target matches the current pathname', () => {
    __setAuthForTests({ isLoaded: true, isSignedIn: true });
    __setPathnameForTests('/sign-in');
    renderHook(() =>
      useExpoAuthRedirect({
        publicPaths: ['/sign-in'],
        signedInPath: '/sign-in',
        signedOutPath: '/sign-in',
      }),
    );
    expect(replace).not.toHaveBeenCalled();
  });
});
