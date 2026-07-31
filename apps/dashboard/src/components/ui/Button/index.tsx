import clsx from '@/lib/clsx';
import { ButtonHTMLAttributes, Ref } from 'react';

import styles from './styles.module.css';
import { Loader } from '../Loader';

export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'muted'
  | 'danger'
  | 'success'
  | 'warning';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: boolean;
  icon?: boolean;
  loading?: boolean;
  lodingLabel?: string;
  ref?: Ref<HTMLButtonElement>;
};

export function Button({
  variant = 'default',
  size = 'md',
  rounded = false,
  icon = false,
  loading = false,
  disabled = false,
  lodingLabel,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[size],
        styles[variant],
        rounded && styles.rounded,
        icon && styles.icon,
        loading && styles.loading,
        disabled && styles.disabled,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader size="sm" className={styles.loader} />}
      {loading && lodingLabel ? lodingLabel : props.children}
    </button>
  );
}

Button.displayName = 'Button';