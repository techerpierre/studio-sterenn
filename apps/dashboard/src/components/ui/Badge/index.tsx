import clsx from '@/lib/clsx';
import { HTMLAttributes, ReactNode } from 'react';

import styles from './styles.module.css';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'outline';

export type BadgeSize = 'sm' | 'md' | 'lg';

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[size],
        styles[variant],
        rounded ? styles.rounded : false,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
