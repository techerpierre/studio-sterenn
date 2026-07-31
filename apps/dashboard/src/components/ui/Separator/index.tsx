import clsx from '@/lib/clsx';
import { HTMLAttributes } from 'react';

import { Text } from '../Text';
import styles from './styles.module.css';

export type SeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  label?: string;
  left?: boolean;
  right?: boolean;
  variant?: 'default' | 'light';
};

export function Separator({
  label,
  left = true,
  right = true,
  className,
  variant = 'default',
  ...props
}: SeparatorProps) {
  return (
    <div
      className={clsx(styles.separator, styles[variant], className)}
      role="separator"
      {...props}
    >
      {left ? <span className={styles.line} aria-hidden="true" /> : null}
      {label ? (
        <Text.Caption className={styles.label}>{label}</Text.Caption>
      ) : null}
      {right ? <span className={styles.line} aria-hidden="true" /> : null}
    </div>
  );
}
