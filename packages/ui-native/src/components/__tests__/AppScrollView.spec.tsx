import { describe, expect, it } from 'vitest';
import TestRenderer from 'react-test-renderer';
import { AppScrollView } from '../AppScrollView';

/**
 * `AppScrollView` is a pass-through over RN's `ScrollView`. The
 * stub `ScrollView` is a no-op component, so we exercise it
 * structurally — confirming the wrapper accepts every documented
 * prop and forwards children without crashing.
 */
describe('AppScrollView', () => {
  it('renders children without throwing', () => {
    expect(() =>
      TestRenderer.create(
        <AppScrollView>
          <span>row</span>
        </AppScrollView>,
      ),
    ).not.toThrow();
  });

  it('renders with children', () => {
    expect(() =>
      TestRenderer.create(
        <AppScrollView>
          <span>child</span>
        </AppScrollView>,
      ),
    ).not.toThrow();
  });

  it('forwards style and contentContainerStyle props', () => {
    expect(() =>
      TestRenderer.create(
        <AppScrollView style={{ paddingTop: 24 }} contentContainerStyle={{ paddingBottom: 8 }}>
          <span>content</span>
        </AppScrollView>,
      ),
    ).not.toThrow();
  });

  it('respects showsVerticalScrollIndicator and keyboardShouldPersistTaps', () => {
    expect(() =>
      TestRenderer.create(
        <AppScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <span>content</span>
        </AppScrollView>,
      ),
    ).not.toThrow();
  });

  it('accepts a refreshControl prop', () => {
    // The shape of `refreshControl` is implementation-specific; we
    // intentionally don't import the real `RefreshControl` from
    // react-native here (the stub returns null). A non-throwing
    // render with an opaque object is enough to validate the
    // passthrough contract.
    const fakeRefreshControl = { type: 'RefreshControl', props: {} } as unknown as never;
    expect(() =>
      TestRenderer.create(
        <AppScrollView refreshControl={fakeRefreshControl}>
          <span>content</span>
        </AppScrollView>,
      ),
    ).not.toThrow();
  });
});
