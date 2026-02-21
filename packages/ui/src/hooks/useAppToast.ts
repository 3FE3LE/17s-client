import { useToastController } from '@tamagui/toast';

export interface AppToastOptions {
  message?: string;
}

export function useAppToast() {
  const toast = useToastController();

  return {
    show(title: string, options?: AppToastOptions) {
      toast.show(title, {
        message: options?.message,
      });
    },
    success(title: string, message?: string) {
      toast.show(title, {
        message,
      });
    },
    error(title: string, message?: string) {
      toast.show(title, {
        message,
      });
    },
    hide() {
      toast.hide();
    },
  };
}
