'use client';

import { XIcon } from 'lucide-react';
import clsx from '@/lib/clsx';

import { ToastData } from './ToastContext';
import styles from './ToastItem.module.css';

export type ToastItemProps = {
  toast: ToastData;
  onDismiss: (id: string) => void;
};

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const handleDismiss = () => {
    onDismiss(toast.id);
  };

  return (
    <div
      className={clsx(styles.item, styles[toast.variant])}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={styles.bar} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.title}>{toast.title}</p>
        {toast.description ? (
          <p className={styles.description}>{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        className={styles.close}
        onClick={handleDismiss}
        aria-label="Fermer la notification"
      >
        <XIcon size={16} />
      </button>
    </div>
  );
}
