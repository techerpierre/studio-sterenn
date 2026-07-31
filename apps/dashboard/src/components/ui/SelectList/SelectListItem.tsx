'use client';

import clsx from '@/lib/clsx';
import { CheckIcon } from 'lucide-react';
import {
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from 'react';

import { useSelectList } from './SelectListContext';
import styles from './SelectListItem.module.css';

export type SelectListItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'value'
> & {
  value: string;
  children: ReactNode;
};

export function SelectListItem({
  value,
  children,
  className,
  onClick,
  disabled,
  ...props
}: SelectListItemProps) {
  const { value: selectedValue, onSelect } = useSelectList();
  const selected = selectedValue === value;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && !disabled) {
      onSelect(value);
    }
  };

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={clsx(
        styles.item,
        selected && styles.selected,
        className
      )}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <span className={styles.label}>{children}</span>
      {selected ? (
        <CheckIcon size={16} className={styles.check} aria-hidden />
      ) : null}
    </button>
  );
}
