'use client';

import clsx from '@/lib/clsx';
import { ReactNode } from 'react';

import { Button, type ButtonProps } from '@/components/ui/Button';

import styles from './SelectListLoadMore.module.css';

export type SelectListLoadMoreProps = Omit<ButtonProps, 'children' | 'variant'> & {
  children?: ReactNode;
  remaining?: number;
};

export function SelectListLoadMore({
  remaining,
  children,
  className,
  size = 'sm',
  ...props
}: SelectListLoadMoreProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      className={clsx(styles.loadMore, className)}
      {...props}
    >
      {children ??
        (remaining != null ? `Voir plus (${remaining})` : 'Voir plus')}
    </Button>
  );
}
