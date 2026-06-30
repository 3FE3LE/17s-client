import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '../../__tests__/renderHook';
import { __resetRouterStubsForTests, __setRouterForTests } from '../../__tests__/expo-router-stub';
import { useReplaceOnceReady } from '../useReplaceOnceReady';

const replace = vi.fn();

beforeEach(() => {
  replace.mockReset();
  __setRouterForTests({ replace });
});

afterEach(() => {
  __resetRouterStubsForTests();
});

describe('useReplaceOnceReady', () => {
  it('does not call router.replace when ready is false', () => {
    renderHook(() => useReplaceOnceReady({ ready: false, href: '/home' }));
    expect(replace).not.toHaveBeenCalled();
  });

  it('calls router.replace(href) once when ready is true', () => {
    renderHook(() => useReplaceOnceReady({ ready: true, href: '/home' }));
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith('/home');
  });

  it('defaults ready to true when omitted', () => {
    renderHook(() => useReplaceOnceReady({ href: '/dashboard' }));
    expect(replace).toHaveBeenCalledWith('/dashboard');
  });

  it('replaces again when href changes after a previous ready render', () => {
    const hook = renderHook<unknown, { href: string; ready: boolean }>(
      (props) => useReplaceOnceReady({ href: props!.href, ready: props!.ready }),
      { initialProps: { href: '/home', ready: true }, withProps: true },
    );

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenLastCalledWith('/home');

    hook.rerender({ href: '/dashboard', ready: true });
    expect(replace).toHaveBeenCalledTimes(2);
    expect(replace).toHaveBeenLastCalledWith('/dashboard');

    hook.unmount();
  });
});
