export interface AppToastOptions {
  message?: string;
}

export function useAppToast() {
  return {
    show(_title: string, _options?: AppToastOptions) {
      // No-op: toast system removed.
    },
    success(_title: string, _message?: string) {
      // No-op: toast system removed.
    },
    error(_title: string, _message?: string) {
      // No-op: toast system removed.
    },
    hide() {
      // No-op: toast system removed.
    },
  };
}
