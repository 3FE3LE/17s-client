/**
 * Tiny `renderHook` helper built on top of `react-test-renderer`.
 *
 * The hooks under test (`useAnimatedValue`, `usePulseAnimation`, ...)
 * need a React renderer, but pulling in `@testing-library/react` drags
 * in jsdom and a larger dependency footprint. `react-test-renderer`
 * works in pure Node, so we render a single hook into a probe
 * component and re-expose `result.current` + `rerender()`.
 *
 * `result.current` is typed as `TResult` (non-undefined) and read
 * through a getter so it reflects the latest render, including any
 * state updates flushed through the renderer's microtask queue.
 * Callers that need to wait for a state update triggered by
 * `setState()` should resolve it inside `await hook.act(() => ...)`
 * so the React scheduler flushes the commit.
 */

import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { Fragment, type ReactElement, useRef, useState } from 'react';

export interface RenderHookResult<TResult, TProps> {
  /** Latest value returned by `callback`. Re-evaluated on every render. */
  result: { current: TResult };
  /** Re-run the hook with new props (only when `withProps: true`). */
  rerender: (props?: TProps) => void;
  unmount: () => void;
  /**
   * Wrap a closure in React's `act()` so microtasks driving `setState`
   * flush before the test reads `result.current`.
   */
  act: (fn: () => void | Promise<void>) => Promise<void>;
}

export interface RenderHookOptions<TProps> {
  initialProps?: TProps;
  /**
   * When `true`, the props passed to `renderHook` are forwarded to the
   * hook factory on every render. When omitted, the callback takes
   * no arguments.
   */
  withProps?: boolean;
}

export function renderHook<TResult, TProps>(
  callback: (props?: TProps) => TResult,
  options: RenderHookOptions<TProps> = {},
): RenderHookResult<TResult, TProps> {
  const latest: { value: TResult | undefined } = { value: undefined };
  let liveProps: TProps | undefined = options.initialProps;

  interface ProbeProps {
    tick: number;
  }

  const Probe = ({ tick }: ProbeProps): ReactElement => {
    const cb = useRef(callback);
    cb.current = callback;
    void tick;
    // When `withProps` is true, TProps is always provided at runtime
    // (the options guard requires `initialProps`). The empty-object
    // fallback silences `exactOptionalPropertyTypes` so TypeScript
    // accepts the branch without losing the test-time guarantee.
    let value: TResult;
    if (options.withProps) {
      const provided: TProps = liveProps ?? ({} as TProps);
      value = cb.current(provided);
    } else {
      value = cb.current();
    }
    latest.value = value;

    // Local state lives only so the probe remains "dynamic" and
    // re-renders after the parent bumps `tick`.
    const [, setLocal] = useState(0);
    void setLocal;
    return <Fragment />;
  };

  let renderer: ReactTestRenderer | null = null;
  act(() => {
    renderer = create(<Probe tick={0} />);
  });

  const rerender = (propsValue?: TProps) => {
    if (!options.withProps) return;
    if (renderer) {
      liveProps = propsValue ?? liveProps;
      act(() => {
        renderer!.update(<Probe tick={0} />);
      });
    }
  };

  const unmount = () => {
    if (!renderer) return;
    act(() => {
      renderer!.unmount();
    });
    renderer = null;
  };

  const runAct = async (fn: () => void | Promise<void>) => {
    await act(async () => {
      await fn();
    });
  };

  return {
    result: {
      get current() {
        // The initial render always populates `latest.value`, so the
        // type narrows to `TResult` for callers. If the hook ever
        // forgets to return a value we surface a clear assertion.
        if (latest.value === undefined) {
          throw new Error('renderHook: hook returned undefined before its first render.');
        }
        return latest.value as TResult;
      },
    },
    rerender,
    unmount,
    act: runAct,
  };
}
