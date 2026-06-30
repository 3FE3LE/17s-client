import { describe, expect, it } from 'vitest';

import { getExpoAuthRedirect } from './expo-redirect';

describe('getExpoAuthRedirect', () => {
  it('returns the signed-out path when not loaded', () => {
    expect(
      getExpoAuthRedirect({
        isLoaded: false,
        isSignedIn: false,
        pathname: '/',
      }),
    ).toBeNull();
  });

  it('redirects signed-out users from private paths to /sign-in', () => {
    expect(
      getExpoAuthRedirect({
        isLoaded: true,
        isSignedIn: false,
        pathname: '/home',
        publicPaths: ['/sign-in'],
        signedInPath: '/',
        signedOutPath: '/sign-in',
      }),
    ).toBe('/sign-in');
  });

  it('redirects signed-in users from public paths to the home', () => {
    expect(
      getExpoAuthRedirect({
        isLoaded: true,
        isSignedIn: true,
        pathname: '/sign-in',
        publicPaths: ['/sign-in'],
        signedInPath: '/',
        signedOutPath: '/sign-in',
      }),
    ).toBe('/');
  });

  it('allows signed-in users to remain on private paths', () => {
    expect(
      getExpoAuthRedirect({
        isLoaded: true,
        isSignedIn: true,
        pathname: '/home',
        publicPaths: ['/sign-in'],
        signedInPath: '/',
        signedOutPath: '/sign-in',
      }),
    ).toBeNull();
  });
});
