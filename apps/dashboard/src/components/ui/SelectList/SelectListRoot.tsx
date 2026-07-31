'use client';

import clsx from '@/lib/clsx';
import { HTMLAttributes, ReactNode } from 'react';

import { SelectListProvider } from './SelectListContext';
import styles from './SelectListRoot.module.css';

export type SelectListRootProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export function SelectListRoot({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: SelectListRootProps) {
  return (
    <SelectListProvider
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <div
        role="listbox"
        className={clsx(styles.list, 'scrollbar-minimal', className)}
        {...props}
      >
        {children}
      </div>
    </SelectListProvider>
  );
}
