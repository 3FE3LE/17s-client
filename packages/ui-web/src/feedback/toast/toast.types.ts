import type { ReactNode } from 'react';
import type { ExternalToast, ToasterProps, toast } from 'sonner';

export type ToastMessage = ReactNode;
export type ToastOptions = ExternalToast;
export type ToastId = string | number;
export type ToastProviderProps = ToasterProps;

export type ToastPromiseOptions<TData = unknown> = Parameters<typeof toast.promise<TData>>[1];

export type NotifyService = {
  success: (message: ToastMessage, options?: ToastOptions) => ToastId;
  error: (message: ToastMessage, options?: ToastOptions) => ToastId;
  info: (message: ToastMessage, options?: ToastOptions) => ToastId;
  warning: (message: ToastMessage, options?: ToastOptions) => ToastId;
  loading: (message: ToastMessage, options?: ToastOptions) => ToastId;
  promise: <TData>(
    promise: Promise<TData> | (() => Promise<TData>),
    options?: ToastPromiseOptions<TData>,
  ) => ReturnType<typeof toast.promise<TData>>;
  dismiss: (id?: ToastId) => ToastId;
};
