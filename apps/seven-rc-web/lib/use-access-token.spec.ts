import { describe, expect, it, vi } from 'vitest';
import { NO_ACTIVE_SESSION, requireAccessToken } from './use-access-token';

describe('requireAccessToken', () => {
  it('returns the cached token without retrying', async () => {
    const getToken = vi.fn().mockResolvedValue('jwt');
    await expect(requireAccessToken(getToken)).resolves.toBe('jwt');
    expect(getToken).toHaveBeenCalledTimes(1);
  });

  it('retries once skipping the cache when the first read is empty', async () => {
    const getToken = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce('fresh');
    await expect(requireAccessToken(getToken)).resolves.toBe('fresh');
    expect(getToken).toHaveBeenLastCalledWith({ skipCache: true });
  });

  it('throws a specific error when there is no session at all', async () => {
    const getToken = vi.fn().mockResolvedValue(null);
    await expect(requireAccessToken(getToken)).rejects.toThrow(NO_ACTIVE_SESSION);
  });
});
