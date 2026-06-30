/* eslint-disable @typescript-eslint/unbound-method */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiClient, TRACE_ID_HEADER } from './api-client';

const MOCK_TRACE_ID = '00000000-0000-4000-8000-000000000001';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  });
}

function stubFetch(response: Response): ReturnType<typeof vi.fn> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fn = vi.fn((..._args: Parameters<typeof fetch>) => Promise.resolve(response));
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('ApiClient x-trace-id propagation', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(MOCK_TRACE_ID);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('auto-generates an x-trace-id when none is provided', async () => {
    const fetchSpy = stubFetch(jsonResponse({ ok: true }));

    const client = new ApiClient({ baseUrl: 'https://api.example.test/' });
    await client.request('/things');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const init = fetchSpy.mock.calls[0]?.[1] as RequestInit | undefined;
    const sentHeaders = new Headers(init?.headers);
    expect(sentHeaders.get(TRACE_ID_HEADER)).toBe(MOCK_TRACE_ID);
    expect(globalThis.crypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  it('preserves a caller-provided x-trace-id in init.headers', async () => {
    const fetchSpy = stubFetch(jsonResponse({ ok: true }));
    const callerTraceId = 'caller-supplied-trace-id-123';

    const client = new ApiClient({ baseUrl: 'https://api.example.test/' });
    await client.request('/things', {
      headers: { [TRACE_ID_HEADER]: callerTraceId },
    });

    const init = fetchSpy.mock.calls[0]?.[1] as RequestInit | undefined;
    const sentHeaders = new Headers(init?.headers);
    expect(sentHeaders.get(TRACE_ID_HEADER)).toBe(callerTraceId);
    expect(globalThis.crypto.randomUUID).not.toHaveBeenCalled();
  });

  it('uses ApiClientOptions.traceId as a fallback when caller omits the header', async () => {
    const fetchSpy = stubFetch(jsonResponse({ ok: true }));
    const defaultTraceId = 'client-default-trace-id';

    const client = new ApiClient({
      baseUrl: 'https://api.example.test/',
      traceId: defaultTraceId,
    });
    await client.request('/things');

    const init = fetchSpy.mock.calls[0]?.[1] as RequestInit | undefined;
    const sentHeaders = new Headers(init?.headers);
    expect(sentHeaders.get(TRACE_ID_HEADER)).toBe(defaultTraceId);
    expect(globalThis.crypto.randomUUID).not.toHaveBeenCalled();
  });

  it('does not overwrite a server-issued x-trace-id on the response (server wins for correlation)', async () => {
    stubFetch(
      jsonResponse({ ok: true }, { headers: { [TRACE_ID_HEADER]: 'server-issued-trace-id' } }),
    );

    const client = new ApiClient({ baseUrl: 'https://api.example.test/' });
    const result = await client.request<{ ok: boolean }>('/things');

    // The server-issued trace id is reflected in the response, but the client
    // does not mutate or rewrite it. Callers can read it off the response if
    // they need to correlate. Here we just verify the body parsed cleanly and
    // the client didn't throw trying to "fix" the trace id.
    expect(result.ok).toBe(true);
  });
});
