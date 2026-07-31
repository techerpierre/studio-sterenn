'use client';

import clsx from '@/lib/clsx';
import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  useId,
  useState,
} from 'react';

import styles from './styles.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'children'
> & {
  size?: SwitchSize;
  label?: ReactNode;
  children?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function Switch({
  size = 'md',
  label,
  children,
  className,
  checked,
  defaultChecked = false,
  disabled = false,
  id,
  onChange,
  ref,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? Boolean(checked) : internalChecked;
  const text = children ?? label;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(event.currentTarget.checked);
    }
    onChange?.(event);
  };

  return (
    <label
      className={clsx(
        styles.root,
        styles[size],
        disabled && styles.disabled,
        className
      )}
      htmlFor={fieldId}
    >
      <input
        {...props}
        ref={ref}
        id={fieldId}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className={styles.track} aria-hidden>
        <span className={styles.thumb} />
      </span>
      {text ? <span className={styles.label}>{text}</span> : null}
    </label>
  );
}
