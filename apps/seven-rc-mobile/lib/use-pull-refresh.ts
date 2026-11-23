import { useState } from 'react';

/**
 * Spinner state for pull-to-refresh only. Binding it to `isFetching` makes the
 * RefreshControl drop in (and the content jump) on every background poll.
 */
export function usePullRefresh(refresh: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    void refresh().finally(() => setRefreshing(false));
  };

  return { refreshing, onRefresh };
}
