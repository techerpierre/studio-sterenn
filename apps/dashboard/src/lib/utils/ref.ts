import type { Ref } from 'react';

/** Assign a value to a callback ref or a RefObject. */
export function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  ref.current = value;
}
