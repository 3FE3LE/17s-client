import { createElement, type ComponentType } from 'react';
import { Toast, useToastState } from '@tamagui/toast';

const ToastTitleAny = Toast.Title as unknown as ComponentType<Record<string, unknown>>;
const ToastDescriptionAny = Toast.Description as unknown as ComponentType<Record<string, unknown>>;
const ToastAny = Toast as unknown as ComponentType<Record<string, unknown>>;

export function AppToastHost() {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) {
    return null;
  }

  return createElement(ToastAny, {
    key: currentToast.id,
    ...(currentToast.duration ? { duration: currentToast.duration } : {}),
    ...(currentToast.viewportName ? { viewportName: currentToast.viewportName } : {}),
    children: [
      createElement(ToastTitleAny, {
        key: 'title',
        children: currentToast.title,
      }),
      currentToast.message
        ? createElement(ToastDescriptionAny, {
            key: 'message',
            children: currentToast.message,
          })
        : null,
    ],
  });
}
