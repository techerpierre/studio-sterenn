'use client';

import clsx from '@/lib/clsx';
import {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  Ref,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import inputStyles from '@/components/ui/TextInput/styles.module.css';
import { assignRef } from '@/lib/utils';

import styles from './styles.module.css';

export type ColorInputSize = 'sm' | 'md' | 'lg';
export type ColorInputVariant = 'default' | 'secondary' | 'ghost';

export type ColorInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'value' | 'defaultValue' | 'onChange'
> & {
  size?: ColorInputSize;
  variant?: ColorInputVariant;
  rounded?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  ref?: Ref<HTMLInputElement>;
};

export function ColorInput({
  size = 'md',
  variant = 'default',
  rounded = false,
  className,
  disabled = false,
  value,
  defaultValue = '#000000',
  onChange,
  onBlur,
  name,
  id,
  placeholder = '#000000',
  ref,
  ...props
}: ColorInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const pickerId = `${fieldId}-picker`;
  const isControlled = value !== undefined;
  const hexRef = useRef<HTMLInputElement | null>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);

  // RHF register may set the DOM value after mount without passing value/defaultValue.
  useLayoutEffect(() => {
    if (isControlled) return;
    const fromDom = hexRef.current?.value;
    if (fromDom) {
      setInternalValue(fromDom);
    }
  }, [isControlled]);

  const currentValue = isControlled ? value : internalValue;
  const swatchColor = normalizeHex(currentValue) ?? '#000000';

  const setHexRef = (node: HTMLInputElement | null) => {
    hexRef.current = node;
    assignRef(ref, node);
  };

  const emitChange = (next: string) => {
    if (!isControlled) {
      setInternalValue(next);
    }

    if (hexRef.current) {
      hexRef.current.value = next;
    }

    onChange?.({
      target: { value: next, name: name ?? '' },
      currentTarget: { value: next, name: name ?? '' },
    } as ChangeEvent<HTMLInputElement>);
  };

  const handleHexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value;
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(event);
  };

  const handleHexBlur = (event: FocusEvent<HTMLInputElement>) => {
    const normalized = normalizeHex(event.currentTarget.value);
    if (normalized && normalized !== event.currentTarget.value) {
      emitChange(normalized);
    }
    onBlur?.(event);
  };

  const handlePickerChange = (event: ChangeEvent<HTMLInputElement>) => {
    emitChange(event.currentTarget.value.toLowerCase());
  };

  return (
    <div
      className={clsx(
        inputStyles.root,
        inputStyles[size],
        inputStyles[variant],
        styles.root,
        styles[size],
        rounded ? inputStyles.rounded : false,
        disabled ? inputStyles.disabled : false,
        className,
      )}
    >
      <label
        className={clsx(styles.swatch, disabled && styles.swatchDisabled)}
        htmlFor={pickerId}
        style={{ backgroundColor: swatchColor }}
        title="Choisir une couleur"
        aria-label="Choisir une couleur"
      >
        <input
          id={pickerId}
          type="color"
          className={styles.nativePicker}
          value={swatchColor}
          disabled={disabled}
          tabIndex={-1}
          onChange={handlePickerChange}
        />
      </label>

      <input
        {...props}
        ref={setHexRef}
        id={fieldId}
        name={name}
        type="text"
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
        className={clsx(inputStyles.input, inputStyles.typographyFromSize)}
        placeholder={placeholder}
        disabled={disabled}
        value={isControlled ? currentValue : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={handleHexChange}
        onBlur={handleHexBlur}
        aria-label={props['aria-label'] ?? 'Couleur hexadécimale'}
      />
    </div>
  );
}

function normalizeHex(raw: string | undefined): string | null {
  if (!raw) return null;
  let value = raw.trim();
  if (!value) return null;
  if (!value.startsWith('#')) {
    value = `#${value}`;
  }

  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    return value.toLowerCase();
  }

  if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
    const [, r, g, b] = value;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return null;
}
