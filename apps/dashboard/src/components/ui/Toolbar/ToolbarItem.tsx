'use client';

import clsx from '@/lib/clsx';
import { ReactNode } from 'react';

import { Button, type ButtonProps } from '@/components/ui/Button';

import styles from './ToolbarItem.module.css';

export type ToolbarItemProps = Omit<
  ButtonProps,
  'children' | 'icon' | 'variant' | 'rounded' | 'rounded'
> & {
  children: ReactNode;
  active?: boolean;
};

export function ToolbarItem({
  children,
  className,
  active = false,
  type = 'button',
  size = 'md',
  ...props
}: ToolbarItemProps) {
  return (
    <Button
      type={type}
      variant="ghost"
      size={size}
      icon
      rounded
      className={clsx(styles.item, active && styles.active, className)}
      aria-pressed={active}
      {...props}
    >
      {children}
    </Button>
  );
}

ToolbarItem.displayName = 'Toolbar.Item';
