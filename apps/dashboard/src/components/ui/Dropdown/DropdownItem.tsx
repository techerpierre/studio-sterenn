'use client';

import clsx from '@/lib/clsx';
import { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';

import { useDropdown } from './DropdownContext';
import styles from './DropdownItem.module.css';

export type DropdownItemVariant = 'default' | 'danger' | 'success' | 'warning';

export type DropdownItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  children: ReactNode;
  closeOnClick?: boolean;
  variant?: DropdownItemVariant;
};

export function DropdownItem({
  children,
  className,
  closeOnClick = true,
  variant = 'default',
  onClick,
  disabled,
  ...props
}: DropdownItemProps) {
  const { close } = useDropdown();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && closeOnClick && !disabled) {
      close();
    }
  };

  return (
    <div className={styles.itemWrap}>
      <button
        type="button"
        role="menuitem"
        className={clsx(styles.item, styles[variant], className)}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
