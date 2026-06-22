import type { ReactNode } from 'react';

export type ToastMessage = ReactNode;
export type ToastOptions = {
  description?: ReactNode;
  duration?: number;
  id?: string | number;
};
export type ToastId = string | number;
export type ToastProviderProps = { children?: ReactNode };
export type ToastPromiseOptions<TData = unknown> = {
  loading?: ToastMessage;
  success?: ToastMessage | ((data: TData) => ToastMessage);
  error?: ToastMessage | ((error: unknown) => ToastMessage);
};

export type NotifyService = {
  success: (message: ToastMessage, options?: ToastOptions) => ToastId;
  error: (message: ToastMessage, options?: ToastOptions) => ToastId;
  info: (message: ToastMessage, options?: ToastOptions) => ToastId;
  warning: (message: ToastMessage, options?: ToastOptions) => ToastId;
  loading: (message: ToastMessage, options?: ToastOptions) => ToastId;
  promise: <TData>(
    promise: Promise<TData> | (() => Promise<TData>),
    options?: ToastPromiseOptions<TData>,
  ) => { unwrap: () => Promise<TData> };
  dismiss: (id?: ToastId) => ToastId;
};

function createToastId(options?: ToastOptions): ToastId {
  return options?.id ?? Date.now();
}

export function ToastProvider({ children }: ToastProviderProps) {
  return children;
}

export const notify: NotifyService = {
  success: (_message, options) => createToastId(options),
  error: (_message, options) => createToastId(options),
  info: (_message, options) => createToastId(options),
  warning: (_message, options) => createToastId(options),
  loading: (_message, options) => createToastId(options),
  promise: (promise) => {
    const resolvedPromise = typeof promise === 'function' ? promise() : promise;
    return { unwrap: () => resolvedPromise };
  },
  dismiss: (id) => id ?? Date.now(),
};
