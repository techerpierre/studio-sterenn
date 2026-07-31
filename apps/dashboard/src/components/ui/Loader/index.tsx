'use client';

import { HTMLAttributes } from 'react';

import styles from './styles.module.css';
import clsx from '@/lib/clsx';

export type LoaderSize = 'sm' | 'md' | 'lg';

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  size?: LoaderSize;
  label?: string;
};

export function Loader({
  size = 'md',
  label = 'Loading...',
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      className={clsx(styles.loader, styles[size], className)}
      role="status"
      aria-live="polite"
      aria-label={label}
      {...props}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className={styles.bar} />
      ))}
    </div>
  );
}
