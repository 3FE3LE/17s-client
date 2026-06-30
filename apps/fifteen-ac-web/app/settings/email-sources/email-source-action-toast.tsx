'use client';

import { useLayoutEffect } from 'react';
import { notify } from '@17suit/ui/feedback/toast';

export type EmailSourceActionToastPayload = {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  clearHref: string;
};

export function EmailSourceActionToast({ payload }: { payload: EmailSourceActionToastPayload }) {
  // Fire the toast synchronously before paint so the user always sees the
  // message even if the redirect clears the URL immediately. The
  // `no-restricted-syntax` rule targets `useEffect`; this `useLayoutEffect`
  // isn't restricted, so we keep the implementation without an inline disable.
  useLayoutEffect(() => {
    notify[payload.type](payload.message);
    window.history.replaceState(null, '', payload.clearHref);
  }, [payload]);

  return null;
}
