import { describe, expect, it } from 'vitest';

import {
  extractSevenReservationsClubRoleFromMePayload,
  getSevenReservationsClubPostAuthPath,
  getSevenReservationsClubRoleHomePath,
  getSevenReservationsClubRoleHint,
  isSevenReservationsClubRole,
  SevenReservationsClubRoles,
} from './onboarding-role';

/**
 * Pure helpers in `onboarding-role.ts`. The seven-rc-mobile and
 * seven-rc-web apps use these in their role-gate logic; the
 * harness here exercises the contract:
 *
 *  - role detection,
 *  - post-auth path resolution,
 *  - role-hint strings,
 *  - extraction from /api/me payloads.
 */
describe('onboarding-role helpers', () => {
  describe('isSevenReservationsClubRole', () => {
    it('returns true for known roles', () => {
      expect(isSevenReservationsClubRole('OWNER')).toBe(true);
      expect(isSevenReservationsClubRole('PLAYER')).toBe(true);
    });

    it('returns false for unknown or non-string values', () => {
      expect(isSevenReservationsClubRole('admin')).toBe(false);
      expect(isSevenReservationsClubRole('')).toBe(false);
      expect(isSevenReservationsClubRole(null)).toBe(false);
      expect(isSevenReservationsClubRole(undefined)).toBe(false);
      expect(isSevenReservationsClubRole(42)).toBe(false);
      expect(isSevenReservationsClubRole({ role: 'OWNER' })).toBe(false);
    });
  });

  describe('SevenReservationsClubRoles', () => {
    it('is a frozen-like list of the supported roles', () => {
      expect(SevenReservationsClubRoles).toEqual(['OWNER', 'PLAYER']);
    });
  });

  describe('getSevenReservationsClubRoleHomePath', () => {
    it('maps OWNER to /owner', () => {
      expect(getSevenReservationsClubRoleHomePath('OWNER')).toBe('/owner');
    });

    it('maps PLAYER to /play', () => {
      expect(getSevenReservationsClubRoleHomePath('PLAYER')).toBe('/play');
    });
  });

  describe('getSevenReservationsClubPostAuthPath', () => {
    it('returns the onboarding path when the user has no role', () => {
      expect(getSevenReservationsClubPostAuthPath(null)).toBe('/onboarding/role');
    });

    it('returns the OWNER home path when the role is OWNER', () => {
      expect(getSevenReservationsClubPostAuthPath('OWNER')).toBe('/owner');
    });

    it('returns the PLAYER home path when the role is PLAYER', () => {
      expect(getSevenReservationsClubPostAuthPath('PLAYER')).toBe('/play');
    });
  });

  describe('getSevenReservationsClubRoleHint', () => {
    it('prompts to pick a role when the user has none', () => {
      expect(getSevenReservationsClubRoleHint(null, 'none')).toBe(
        'Selecciona tu rol para continuar.',
      );
    });

    it('describes the current role from the configured source', () => {
      expect(getSevenReservationsClubRoleHint('OWNER', 'backend')).toBe(
        'Rol actual detectado por backend: OWNER',
      );
      expect(getSevenReservationsClubRoleHint('PLAYER', 'clerk')).toBe(
        'Rol actual detectado por clerk: PLAYER',
      );
    });
  });

  describe('extractSevenReservationsClubRoleFromMePayload', () => {
    it('returns the role on the top-level object', () => {
      expect(extractSevenReservationsClubRoleFromMePayload({ role: 'OWNER' })).toBe('OWNER');
      expect(extractSevenReservationsClubRoleFromMePayload({ role: 'PLAYER' })).toBe('PLAYER');
    });

    it('falls through to the nested user.role when the top-level role is missing', () => {
      expect(extractSevenReservationsClubRoleFromMePayload({ user: { role: 'PLAYER' } })).toBe(
        'PLAYER',
      );
    });

    it('ignores unknown values and returns null', () => {
      expect(extractSevenReservationsClubRoleFromMePayload({ role: 'admin' })).toBeNull();
      expect(extractSevenReservationsClubRoleFromMePayload({ user: { role: 'admin' } })).toBeNull();
      expect(
        extractSevenReservationsClubRoleFromMePayload({ role: 'OWNER', user: { role: 'PLAYER' } }),
      ).toBe('OWNER');
    });

    it('returns null for nullish, non-object, and empty payloads', () => {
      expect(extractSevenReservationsClubRoleFromMePayload(null)).toBeNull();
      expect(extractSevenReservationsClubRoleFromMePayload(undefined)).toBeNull();
      expect(extractSevenReservationsClubRoleFromMePayload('OWNER')).toBeNull();
      expect(extractSevenReservationsClubRoleFromMePayload({})).toBeNull();
    });

    it('returns null when the user field is present but not an object', () => {
      expect(extractSevenReservationsClubRoleFromMePayload({ user: 'PLAYER' })).toBeNull();
    });
  });
});
