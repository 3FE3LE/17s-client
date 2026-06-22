import { toast } from 'sonner';
import type { NotifyService } from './toast.types';

export const notify: NotifyService = {
  success: (message, options) => toast.success(message, options),
  error: (message, options) => toast.error(message, options),
  info: (message, options) => toast.info(message, options),
  warning: (message, options) => toast.warning(message, options),
  loading: (message, options) => toast.loading(message, options),
  promise: (promise, options) => toast.promise(promise, options),
  dismiss: (id) => toast.dismiss(id),
};
