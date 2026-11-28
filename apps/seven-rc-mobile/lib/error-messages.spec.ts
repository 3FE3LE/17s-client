import { SevenRcApiError } from '@17suit/module-seven-reservations-club/client';
import { describe, expect, it } from 'vitest';
import {
  humanizeClerkError,
  humanizeError,
  isClientError,
  isTransportError,
} from './error-messages';
import { tEn, tEs } from './__tests__/test-translate';

const api = (status: number) => new SevenRcApiError(`failed (${status})`, status);

describe('humanizeError with SevenRcApiError', () => {
  it('maps statuses', () => {
    expect(humanizeError(api(401), tEn)).toBe(tEn('errors.session'));
    expect(humanizeError(api(403), tEn)).toBe(tEn('errors.forbidden'));
    expect(humanizeError(api(404), tEn)).toBe(tEn('errors.notFound'));
    expect(humanizeError(api(429), tEn)).toBe(tEn('errors.rate'));
    expect(humanizeError(api(503), tEn)).toBe(tEn('errors.server'));
  });

  it('uses the context for 409 and 400/422', () => {
    expect(humanizeError(api(409), tEn, 'create')).toBe(tEn('errors.conflict.create'));
    expect(humanizeError(api(400), tEn, 'cancel')).toBe(tEn('errors.badRequest.cancel'));
    expect(humanizeError(api(422), tEn, 'payment')).toBe(tEn('errors.badRequest.payment'));
  });

  it('uses the contextual fallback for other statuses', () => {
    expect(humanizeError(api(418), tEn, 'save')).toBe(tEn('errors.fallback.save'));
  });
});

describe('humanizeError with plain errors', () => {
  it('detects transport failures', () => {
    expect(humanizeError(new Error('Network request failed'), tEn)).toBe(tEn('errors.network'));
    expect(humanizeError('fetch failed: ECONNREFUSED', tEn)).toBe(tEn('errors.network'));
    const abort = new Error('The operation was aborted');
    abort.name = 'AbortError';
    expect(humanizeError(abort, tEn)).toBe(tEn('errors.network'));
  });

  it('maps well-known messages and embedded statuses', () => {
    expect(humanizeError(new Error('Unauthorized'), tEn)).toBe(tEn('errors.session'));
    expect(humanizeError(new Error('Failed to fetch platform user (401)'), tEn)).toBe(
      tEn('errors.session'),
    );
    expect(humanizeError(new Error('Forbidden'), tEn)).toBe(tEn('errors.forbidden'));
    expect(humanizeError(new Error('x (403)'), tEn)).toBe(tEn('errors.forbidden'));
    expect(humanizeError(new Error('Not Found'), tEn)).toBe(tEn('errors.notFound'));
    expect(humanizeError(new Error('x (404)'), tEn)).toBe(tEn('errors.notFound'));
    expect(humanizeError(new Error('Conflict'), tEn, 'confirm')).toBe(
      tEn('errors.conflict.confirm'),
    );
    expect(humanizeError(new Error('x (409)'), tEn, 'reject')).toBe(tEn('errors.conflict.reject'));
    expect(humanizeError(new Error('Bad Request'), tEn, 'save')).toBe(
      tEn('errors.badRequest.save'),
    );
    expect(humanizeError(new Error('Unprocessable Entity'), tEn, 'manage')).toBe(
      tEn('errors.badRequest.manage'),
    );
    expect(humanizeError(new Error('x (400)'), tEn, 'save')).toBe(tEn('errors.badRequest.save'));
    expect(humanizeError(new Error('Too Many Requests'), tEn)).toBe(tEn('errors.rate'));
    expect(humanizeError(new Error('x (429)'), tEn)).toBe(tEn('errors.rate'));
    expect(humanizeError(new Error('Internal Server Error'), tEn)).toBe(tEn('errors.server'));
    expect(humanizeError(new Error('x (502)'), tEn)).toBe(tEn('errors.server'));
  });

  it('falls back for unknown or non-error values', () => {
    expect(humanizeError(new Error('boom'), tEn)).toBe(tEn('errors.fallback.load'));
    expect(humanizeError(undefined, tEn, 'create')).toBe(tEn('errors.fallback.create'));
    expect(humanizeError({ message: 'x' }, tEn)).toBe(tEn('errors.fallback.load'));
  });

  it('follows the locale', () => {
    expect(humanizeError(api(401), tEs)).toBe(tEs('errors.session'));
    expect(humanizeError(api(401), tEs)).not.toBe(humanizeError(api(401), tEn));
  });
});

describe('isTransportError', () => {
  it('is false for API errors and messages carrying a status', () => {
    expect(isTransportError(api(500))).toBe(false);
    expect(isTransportError(new Error('Network error (502)'))).toBe(false);
  });

  it('is true for timeouts and unreachable hosts', () => {
    expect(isTransportError(new Error('Request timed out'))).toBe(true);
    expect(isTransportError('Unable to reach server')).toBe(true);
  });

  it('is false for unrelated errors and non-strings', () => {
    expect(isTransportError(new Error('boom'))).toBe(false);
    expect(isTransportError(42)).toBe(false);
  });
});

describe('isClientError', () => {
  it('classifies API errors by status', () => {
    expect(isClientError(api(403))).toBe(true);
    expect(isClientError(api(500))).toBe(false);
  });

  it('classifies plain errors by embedded status or name', () => {
    expect(isClientError(new Error('x (401)'))).toBe(true);
    expect(isClientError(new Error('x (503)'))).toBe(false);
    expect(isClientError(new Error(' Unauthorized '))).toBe(true);
    expect(isClientError(new Error('Forbidden'))).toBe(true);
    expect(isClientError(new Error('boom'))).toBe(false);
    expect(isClientError('Unauthorized')).toBe(false);
  });
});

describe('humanizeClerkError', () => {
  it('maps known clerk codes', () => {
    expect(humanizeClerkError({ errors: [{ code: 'form_password_pwned' }] }, 'fb', tEn)).toBe(
      tEn('clerk.passwordPwned'),
    );
    expect(humanizeClerkError({ errors: [{ code: 'too_many_requests' }] }, 'fb', tEs)).toBe(
      tEs('errors.rate'),
    );
  });

  it('handles network errors and fallbacks', () => {
    expect(humanizeClerkError(new Error('Network down'), 'fb', tEn)).toBe(tEn('errors.network'));
    expect(humanizeClerkError({ errors: [{ code: 'weird' }] }, 'fb', tEn)).toBe('fb');
    expect(humanizeClerkError({ errors: [] }, 'fb', tEn)).toBe('fb');
    expect(humanizeClerkError(null, 'fb', tEn)).toBe('fb');
  });
});
