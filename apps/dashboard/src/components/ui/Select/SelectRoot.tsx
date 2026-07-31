'use client';

import { ReactNode } from 'react';

import { Button, type ButtonProps } from '@/components/ui/Button';

import { SelectProvider } from './SelectContext';
import { SelectContent } from './SelectContent';

export type SelectRootProps = {
  children: ReactNode;
  placeholder?: string;
  emptyPlaceholder?: ReactNode;
  className?: string;
  align?: 'start' | 'end';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  rounded?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  footer?: ReactNode;
  onBottom?: () => void;
  matchTriggerWidth?: boolean;
  trigger?: ReactNode;
};

export function SelectRoot({
  children,
  placeholder = 'Sélectionner',
  emptyPlaceholder,
  className,
  align = 'start',
  value,
  defaultValue,
  onValueChange,
  variant = 'outline',
  size = 'md',
  rounded = false,
  disabled = false,
  searchable = false,
  onSearch,
  searchPlaceholder = 'Rechercher',
  footer,
  onBottom,
  matchTriggerWidth = true,
  trigger,
}: SelectRootProps) {
  return (
    <SelectProvider
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      searchable={searchable}
      onSearch={onSearch}
    >
      <SelectContent
        placeholder={placeholder}
        emptyPlaceholder={emptyPlaceholder}
        className={className}
        align={align}
        variant={variant}
        size={size}
        rounded={rounded}
        disabled={disabled}
        searchPlaceholder={searchPlaceholder}
        footer={footer}
        onBottom={onBottom}
        matchTriggerWidth={matchTriggerWidth}
        trigger={trigger}
      >
        {children}
      </SelectContent>
    </SelectProvider>
  );
}
