'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export type SelectListContextType = {
  value: string | undefined;
  onSelect: (value: string) => void;
};

export const SelectListContext = createContext<SelectListContextType | null>(
  null
);

export type SelectListProviderProps = PropsWithChildren<{
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>;

export function SelectListProvider({
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
}: SelectListProviderProps) {
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  const value = isControlled ? valueProp : uncontrolledValue;

  const onSelect = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChangeRef.current?.(next);
    },
    [isControlled]
  );

  return (
    <SelectListContext.Provider value={{ value, onSelect }}>
      {children}
    </SelectListContext.Provider>
  );
}

export function useSelectList() {
  const context = useContext(SelectListContext);
  if (!context) {
    throw new Error('useSelectList must be used within a SelectList');
  }
  return context;
}
