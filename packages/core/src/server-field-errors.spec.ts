import { describe, expect, it, vi } from 'vitest';
import { ApiError } from './api-client';
import { applyServerFieldErrors, SERVER_FIELD_ERROR_MESSAGE } from './server-field-errors';

type Name = 'name' | 'duration';
const MAP = { name: 'name', slotDurationMinutes: 'duration' } as const;

function apiError(fields?: Record<string, string[]>) {
  return new ApiError({
    code: 'HTTP_ERROR',
    message: 'bad',
    status: 400,
    ...(fields && { fields }),
  });
}

describe('applyServerFieldErrors', () => {
  it('maps server properties to form fields with the stable code, not the server text', () => {
    const setError = vi.fn();
    const applied = applyServerFieldErrors<Name>(
      apiError({ slotDurationMinutes: ['slotDurationMinutes must not be greater than 240'] }),
      setError,
      MAP,
    );
    expect(applied).toBe(true);
    expect(setError).toHaveBeenCalledOnce();
    expect(setError).toHaveBeenCalledWith('duration', {
      type: 'server',
      message: SERVER_FIELD_ERROR_MESSAGE,
    });
  });

  it('returns false and sets nothing for unmapped fields, the _ bucket, or no fields', () => {
    for (const error of [apiError({ other: ['x'], _: ['y'] }), apiError(), new Error('x'), null]) {
      const setError = vi.fn();
      expect(applyServerFieldErrors<Name>(error, setError, MAP)).toBe(false);
      expect(setError).not.toHaveBeenCalled();
    }
  });

  it('ignores empty message lists and prototype keys', () => {
    const setError = vi.fn();
    const error = apiError({ name: [], constructor: ['x'] });
    expect(applyServerFieldErrors<Name>(error, setError, MAP)).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
