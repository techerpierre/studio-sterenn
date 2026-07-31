'use client';

import clsx from '@/lib/clsx';
import Link from 'next/link';
import {
  ComponentPropsWithoutRef,
  ElementType,
  MouseEvent,
  ReactNode,
} from 'react';

import { useTabs } from './TabsContext';
import styles from './TabsItem.module.css';

type TabsItemOwnProps = {
  value: string;
  children: ReactNode;
  href?: string;
  disabled?: boolean;
  className?: string;
};

export type TabsItemProps<TAs extends ElementType = 'button'> =
  TabsItemOwnProps & {
    as?: TAs;
  } & Omit<
    ComponentPropsWithoutRef<TAs>,
    keyof TabsItemOwnProps | 'as' | 'value'
  >;

export function TabsItem<TAs extends ElementType = 'button'>({
  as,
  value,
  children,
  className,
  disabled = false,
  href,
  ...props
}: TabsItemProps<TAs>) {
  const {
    value: selectedValue,
    onSelect,
    registerItem,
    size,
    fullWidth,
  } = useTabs();
  const selected = selectedValue === value;
  const useLink = !disabled && href != null && as == null;
  const Component = (as ?? (useLink ? Link : 'button')) as ElementType;

  const { onClick, ...rest } = props as {
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  } & Record<string, unknown>;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) {
      if (disabled && href != null) {
        event.preventDefault();
      }
      return;
    }
    onSelect(value);
  };

  const classNames = clsx(
    styles.item,
    styles[size],
    fullWidth && styles.fullWidth,
    selected && styles.active,
    disabled && styles.disabled,
    className
  );

  if (Component === 'button' || disabled) {
    return (
      <button
        ref={(element) => registerItem(value, element)}
        type="button"
        role="tab"
        aria-selected={selected}
        tabIndex={disabled ? -1 : selected ? 0 : -1}
        className={classNames}
        disabled={disabled}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <Component
      ref={(element: HTMLElement | null) => registerItem(value, element)}
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      className={classNames}
      href={href}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Component>
  );
}
