import { describe, expect, it } from 'vitest';

import { afterAuthPath, withDevSession } from './session-handoff';

const product = 'https://product.example.com/play?venue=1';

describe('afterAuthPath', () => {
  it('keeps same-site paths', () => {
    expect(afterAuthPath('/apps')).toBe('/apps');
  });

  it('sends other origins through /continue', () => {
    expect(afterAuthPath(product)).toBe(`/continue?redirect_url=${encodeURIComponent(product)}`);
  });
});

describe('withDevSession', () => {
  it('adds the token for a development instance and keeps the query', () => {
    expect(withDevSession(product, 'pk_test_x', 'token')).toBe(`${product}&__clerk_db_jwt=token`);
  });

  it('replaces a token that was already in the target', () => {
    expect(withDevSession(`${product}&__clerk_db_jwt=other`, 'pk_test_x', 'token')).toBe(
      `${product}&__clerk_db_jwt=token`,
    );
  });

  it('never adds it for a production instance', () => {
    expect(withDevSession(product, 'pk_live_x', 'token')).toBe(product);
  });

  it('never adds it without a token or a key', () => {
    expect(withDevSession(product, 'pk_test_x', undefined)).toBe(product);
    expect(withDevSession(product, undefined, 'token')).toBe(product);
  });

  it('never adds it to a same-site path', () => {
    expect(withDevSession('/apps', 'pk_test_x', 'token')).toBe('/apps');
  });
});
