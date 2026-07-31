'use client';

import clsx from '@/lib/clsx';
import { CheckIcon } from 'lucide-react';
import {
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
  useEffect,
} from 'react';

import { useSelect } from './SelectContext';
import styles from './SelectItem.module.css';

export type SelectItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'value'
> & {
  value: string;
  children: ReactNode;
};

function getNodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (typeof node === 'object' && 'props' in node) {
    return getNodeText(
      (node as { props?: { children?: ReactNode } }).props?.children
    );
  }
  return '';
}

export function SelectItem({
  value,
  children,
  className,
  onClick,
  disabled,
  ...props
}: SelectItemProps) {
  const {
    value: selectedValue,
    onSelect,
    registerOption,
    unregisterOption,
    searchQuery,
    filterItems,
  } = useSelect();
  const selected = selectedValue === value;

  useEffect(() => {
    registerOption(value, children);
    return () => unregisterOption(value);
  }, [value, children, registerOption, unregisterOption]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && !disabled) {
      onSelect(value);
    }
  };

  if (filterItems && searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    const label = getNodeText(children).toLowerCase();
    const matches =
      label.includes(query) || value.toLowerCase().includes(query);
    if (!matches) return null;
  }

  return (
    <div className={styles.itemWrap}>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        className={clsx(styles.item, selected ? styles.selected : false, className)}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        <span className={styles.label}>{children}</span>
        {selected ? (
          <CheckIcon size={16} className={styles.check} aria-hidden />
        ) : null}
      </button>
    </div>
  );
}
