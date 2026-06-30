/* eslint-disable no-restricted-syntax -- TODO(useEffect): migrate to RSC / event handlers / derived state per audit policy. */
'use client';

import { useEffect } from 'react';
import { notify } from '@17suit/ui/feedback/toast';

export type EmailSourceActionToastPayload = {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  clearHref: string;
};

export function EmailSourceActionToast({ payload }: { payload: EmailSourceActionToastPayload }) {
  useEffect(() => {
    notify[payload.type](payload.message);
    window.history.replaceState(null, '', payload.clearHref);
  }, [payload]);

  return null;
}
