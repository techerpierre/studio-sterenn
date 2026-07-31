'use client';

import clsx from '@/lib/clsx';
import { SearchIcon, XIcon } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

import {
  TextInput,
  type TextInputProps,
  type TextInputSize,
} from '@/components/ui/TextInput';

import styles from './styles.module.css';

export type SearchBarProps = Omit<TextInputProps, 'rightItem' | 'type'>;

export function SearchBar({
  value,
  defaultValue = '',
  onChange,
  size = 'md',
  disabled,
  loading,
  className,
  ...props
}: SearchBarProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(String(defaultValue ?? ''));
  const currentValue = isControlled ? String(value ?? '') : internalValue;
  const hasText = currentValue.length > 0;
  const isDisabled = Boolean(disabled || loading);
  const iconSize = ICON_SIZE[size];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }

    onChange?.({
      target: { value: '' },
      currentTarget: { value: '' },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <TextInput
      type="search"
      size={size}
      disabled={disabled}
      loading={loading}
      value={currentValue}
      onChange={handleChange}
      className={clsx(styles.root, className)}
      rightItem={
        hasText ? (
          <button
            type="button"
            className={styles.clear}
            onClick={handleClear}
            disabled={isDisabled}
            aria-label="Effacer la recherche"
            tabIndex={-1}
          >
            <XIcon size={iconSize} />
          </button>
        ) : (
          <SearchIcon size={iconSize} aria-hidden />
        )
      }
      {...props}
    />
  );
}

const ICON_SIZE: Record<TextInputSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};
