import { describe, expect, it } from 'vitest';
import TestRenderer from 'react-test-renderer';
import { AppModal } from '../AppModal';

/**
 * `AppModal` is a thin wrapper over React Native's `Modal`. The
 * native bridge isn't available in Node, so the stub `Modal` is a
 * no-op component (see `vitest.config.ts`). We assert the wrapper's
 * call signature: it must accept the documented props without
 * throwing, regardless of the rendered output.
 *
 * The component is exercised end-to-end by the mobile apps
 * (fifteen-ac-mobile, seven-rc-mobile). Here we focus on the
 * static contract — props in, stub Modal invoked, children passed
 * through.
 */
describe('AppModal', () => {
  it('renders without throwing when visible', () => {
    expect(() =>
      TestRenderer.create(
        <AppModal visible>
          <span data-testid="content">hello</span>
        </AppModal>,
      ),
    ).not.toThrow();
  });

  it('renders without throwing when visible=false', () => {
    expect(() =>
      TestRenderer.create(
        <AppModal visible={false}>
          <span>hidden</span>
        </AppModal>,
      ),
    ).not.toThrow();
  });

  it('accepts the documented prop combinations', () => {
    expect(() =>
      TestRenderer.create(
        <AppModal visible transparent={false} animationType="fade">
          <span>fade</span>
        </AppModal>,
      ),
    ).not.toThrow();
  });

  it('does not crash with nested children', () => {
    expect(() =>
      TestRenderer.create(
        <AppModal visible>
          <ul>
            <li>one</li>
            <li>two</li>
          </ul>
        </AppModal>,
      ),
    ).not.toThrow();
  });
});
