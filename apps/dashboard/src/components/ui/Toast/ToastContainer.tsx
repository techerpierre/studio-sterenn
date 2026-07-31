'use client';

import { ToastItem } from './ToastItem';
import { useToast } from './ToastContext';
import styles from './ToastContainer.module.css';

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
