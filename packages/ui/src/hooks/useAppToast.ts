export interface AppToastOptions {
  message?: string;
}

export function useAppToast() {
  return {
    show(_title: string, _options?: AppToastOptions) {
      void _title;
      void _options;
      // No-op: toast system removed.
    },
    success(_title: string, _message?: string) {
      void _title;
      void _message;
      // No-op: toast system removed.
    },
    error(_title: string, _message?: string) {
      void _title;
      void _message;
      // No-op: toast system removed.
    },
    hide() {
      // No-op: toast system removed.
    },
  };
}
