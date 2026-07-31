'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsVariant = 'default' | 'secondary';

export type TabsContextType = {
  value: string | undefined;
  onSelect: (value: string) => void;
  registerItem: (value: string, element: HTMLElement | null) => void;
  getItem: (value: string) => HTMLElement | undefined;
  size: TabsSize;
  variant: TabsVariant;
  fullWidth: boolean;
};

export const TabsContext = createContext<TabsContextType | null>(null);

export type TabsProviderProps = PropsWithChildren<{
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: TabsSize;
  variant?: TabsVariant;
  fullWidth?: boolean;
}>;

export function TabsProvider({
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'md',
  variant = 'default',
  fullWidth = false,
}: TabsProviderProps) {
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const itemsRef = useRef(new Map<string, HTMLElement>());
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

  const registerItem = useCallback(
    (itemValue: string, element: HTMLElement | null) => {
      if (element) {
        itemsRef.current.set(itemValue, element);
      } else {
        itemsRef.current.delete(itemValue);
      }
    },
    []
  );

  const getItem = useCallback(
    (itemValue: string) => itemsRef.current.get(itemValue),
    []
  );

  return (
    <TabsContext.Provider
      value={{
        value,
        onSelect,
        registerItem,
        getItem,
        size,
        variant,
        fullWidth,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('useTabs must be used within a Tabs');
  }

  return context;
}
