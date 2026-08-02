'use client';

import { useToast } from '@/components/ui/Toast';
import {
  type ActionFeedbackMessages,
  type RunWithToastOptions,
  runWithToast,
} from '@/lib/utils/action-feedback';

export type { ActionFeedbackMessages, RunWithToastOptions };

export function useActionFeedback() {
  const { toast } = useToast();

  return {
    run: <T>(
      action: () => Promise<T>,
      messages: ActionFeedbackMessages,
      options?: RunWithToastOptions,
    ) => runWithToast(action, toast, messages, options),
  };
}
