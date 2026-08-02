import type { ToastInput } from '@/components/ui/Toast';

export type ActionFeedbackMessages = {
  /** Omit to skip the success toast (e.g. auth flows that only redirect). */
  successTitle?: string;
  successDescription?: string;
  errorTitle: string;
  errorDescription?: string;
};

export type RunWithToastOptions = {
  /** If true, rethrow after showing the error toast. Default: false */
  rethrow?: boolean;
};

export async function runWithToast<T>(
  action: () => Promise<T>,
  toast: (input: ToastInput) => void,
  messages: ActionFeedbackMessages,
  options?: RunWithToastOptions,
): Promise<T | undefined> {
  try {
    const result = await action();
    if (messages.successTitle) {
      toast({
        title: messages.successTitle,
        description: messages.successDescription,
        variant: 'success',
      });
    }
    return result;
  } catch (error) {
    console.error(error);
    toast({
      title: messages.errorTitle,
      description: messages.errorDescription,
      variant: 'danger',
    });
    if (options?.rethrow) {
      throw error;
    }
    return undefined;
  }
}
