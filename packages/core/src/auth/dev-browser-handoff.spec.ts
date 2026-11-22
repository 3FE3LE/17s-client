import { describe, expect, it } from 'vitest';

import { expireStaleDevBrowserCookies, staleDevBrowserCookies } from './dev-browser-handoff';

const HANDOFF = 'https://product.example.com/play?__clerk_db_jwt=new';

function request(url: string, cookie = '__clerk_db_jwt_abc12_-Z=old; __clerk_db_jwt=old; other=1') {
  return { url, headers: new Headers({ cookie }) };
}

function handshake() {
  return new Response(null, {
    status: 307,
    headers: { location: 'https://x.clerk.accounts.dev/v1/client/handshake?reason=sync' },
  });
}

describe('staleDevBrowserCookies', () => {
  it('finds the suffixed cookie that disagrees with the token in the URL', () => {
    expect(staleDevBrowserCookies(request(HANDOFF), 'pk_test_x')).toEqual([
      '__clerk_db_jwt_abc12_-Z',
    ]);
  });

  it('keeps a suffixed cookie that already matches', () => {
    expect(staleDevBrowserCookies(request(HANDOFF, '__clerk_db_jwt_abc=new'), 'pk_test_x')).toEqual(
      [],
    );
  });

  it('does nothing for production instances', () => {
    expect(staleDevBrowserCookies(request(HANDOFF), 'pk_live_x')).toEqual([]);
  });

  it('does nothing without a token in the URL', () => {
    expect(
      staleDevBrowserCookies(request('https://product.example.com/play'), 'pk_test_x'),
    ).toEqual([]);
  });
});

describe('expireStaleDevBrowserCookies', () => {
  it('expires the stale cookie on the handshake redirect', () => {
    const response = handshake();
    expireStaleDevBrowserCookies(request(HANDOFF), response, 'pk_test_x');
    expect(response.headers.get('set-cookie')).toBe(
      '__clerk_db_jwt_abc12_-Z=; Path=/; Max-Age=0; Secure',
    );
  });

  it('leaves other responses untouched', () => {
    const response = new Response(null, { status: 200 });
    expireStaleDevBrowserCookies(request(HANDOFF), response, 'pk_test_x');
    expect(response.headers.get('set-cookie')).toBeNull();
  });
});
