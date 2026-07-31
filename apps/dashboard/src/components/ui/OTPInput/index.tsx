'use client';

import clsx from '@/lib/clsx';
import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import styles from './styles.module.css';
import { Loader } from '../Loader';
import { sanitizeValue, toDigits } from '@/lib/utils';

export type OTPInputSize = 'sm' | 'md' | 'lg';
export type OTPInputVariant = 'default' | 'secondary';

export type OTPInputProps = {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  size?: OTPInputSize;
  variant?: OTPInputVariant;
  rounded?: boolean;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  className?: string;
  inputMode?: 'numeric' | 'text';
  'aria-label'?: string;
};

export function OTPInput({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  size = 'md',
  variant = 'default',
  rounded = false,
  disabled = false,
  loading = false,
  autoFocus = false,
  name,
  id,
  className,
  inputMode = 'numeric',
  'aria-label': ariaLabel = 'Code de vérification',
}: OTPInputProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    sanitizeValue(defaultValue, length, inputMode === 'numeric')
  );
  const currentValue = sanitizeValue(
    isControlled ? value : uncontrolledValue,
    length,
    inputMode === 'numeric'
  );
  const digits = toDigits(currentValue, length);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const isDisabled = Boolean(disabled || loading);
  const completedRef = useRef(false);

  useEffect(() => {
    if (currentValue.length === length) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.(currentValue);
      }
    } else {
      completedRef.current = false;
    }
  }, [currentValue, length, onComplete]);

  const updateValue = (nextValue: string, focusIndex?: number) => {
    const sanitized = sanitizeValue(nextValue, length, inputMode === 'numeric');
    if (!isControlled) setUncontrolledValue(sanitized);
    onChange?.(sanitized);

    if (focusIndex !== undefined) {
      inputRefs.current[focusIndex]?.focus();
      inputRefs.current[focusIndex]?.select();
    }
  };

  const handleChange = (index: number, raw: string) => {
    if (isDisabled) return;

    const incoming = sanitizeValue(raw, length - index, inputMode === 'numeric');
    if (!incoming) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      updateValue(nextDigits.join(''));
      return;
    }

    const nextDigits = [...digits];
    const chars = incoming.split('');
    chars.forEach((char, offset) => {
      const target = index + offset;
      if (target < length) nextDigits[target] = char;
    });

    const nextFocus = Math.min(index + chars.length, length - 1);
    updateValue(nextDigits.join(''), nextFocus);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    if (event.key === 'Backspace') {
      event.preventDefault();
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = '';
        updateValue(nextDigits.join(''), index);
        return;
      }
      if (index > 0) {
        const nextDigits = [...digits];
        nextDigits[index - 1] = '';
        updateValue(nextDigits.join(''), index - 1);
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    const pasted = sanitizeValue(
      event.clipboardData.getData('text'),
      length,
      inputMode === 'numeric'
    );
    if (!pasted) return;
    updateValue(pasted, Math.min(pasted.length, length - 1));
  };

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  return (
    <div
      className={clsx(
        styles.root,
        styles[size],
        styles[variant],
        rounded ? styles.rounded : false,
        isDisabled ? styles.disabled : false,
        className
      )}
      role="group"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {name ? <input type="hidden" name={name} value={currentValue} /> : null}

      {digits.map((digit, index) => (
        <input
          key={`${fieldId}-${index}`}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          id={index === 0 ? fieldId : undefined}
          className={styles.cell}
          type="text"
          inputMode={inputMode}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          autoFocus={autoFocus && index === 0}
          maxLength={length}
          value={digit}
          disabled={isDisabled}
          aria-label={`Chiffre ${index + 1} sur ${length}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
        />
      ))}

      {loading ? (
        <span className={styles.loaderWrap}>
          <Loader size="sm" className={styles.loader} />
        </span>
      ) : null}
    </div>
  );
}
