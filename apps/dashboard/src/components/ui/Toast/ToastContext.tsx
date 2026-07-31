'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type ToastVariant = 'default' | 'success' | 'danger' | 'warning';

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastData = ToastInput & {
  id: string;
  variant: ToastVariant;
  duration: number;
};

export type ToastContextType = {
  toasts: ToastData[];
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const DEFAULT_DURATION = 4000;
const MAX_TOASTS = 5;

export const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();
      const duration = input.duration ?? DEFAULT_DURATION;
      const nextToast: ToastData = {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? 'default',
        duration,
      };

      setToasts((current) => [...current, nextToast].slice(-MAX_TOASTS));

      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }

      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      toasts,
      toast,
      dismiss,
      clear,
    }),
    [toasts, toast, dismiss, clear]
  );

  return (
    <ToastContext value={value}>{children}</ToastContext>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
