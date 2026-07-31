'use client';

import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { usePopupState, type PopupState } from '@/lib/popup';

export type SelectContextType = PopupState & {
  value: string | undefined;
  onSelect: (value: string) => void;
  getLabel: (value: string | undefined) => ReactNode | undefined;
  registerOption: (value: string, label: ReactNode) => void;
  unregisterOption: (value: string) => void;
  searchable: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterItems: boolean;
};

export const SelectContext = createContext<SelectContextType | null>(null);

export type SelectProviderProps = PropsWithChildren<{
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  searchable?: boolean;
  onSearch?: (query: string) => void;
}>;

export function SelectProvider({
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  searchable = false,
  onSearch,
}: SelectProviderProps) {
  const popup = usePopupState();
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [labels, setLabels] = useState<Record<string, ReactNode>>({});
  const [searchQuery, setSearchQueryState] = useState('');

  const isSearchable = Boolean(searchable || onSearch);
  const filterItems = isSearchable && !onSearch;
  const value = isControlled ? valueProp : uncontrolledValue;

  useEffect(() => {
    if (!popup.open) {
      setSearchQueryState('');
    }
  }, [popup.open]);

  const onSelect = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
      popup.close();
    },
    [isControlled, onValueChange, popup.close]
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchQueryState(query);
      onSearch?.(query);
    },
    [onSearch]
  );

  const registerOption = useCallback((optionValue: string, label: ReactNode) => {
    setLabels((current) => {
      if (current[optionValue] === label) return current;
      return { ...current, [optionValue]: label };
    });
  }, []);

  const unregisterOption = useCallback((optionValue: string) => {
    setLabels((current) => {
      if (!(optionValue in current)) return current;
      const next = { ...current };
      delete next[optionValue];
      return next;
    });
  }, []);

  const getLabel = useCallback(
    (optionValue: string | undefined) => {
      if (optionValue === undefined) return undefined;
      return labels[optionValue];
    },
    [labels]
  );

  const contextValue = useMemo(
    () => ({
      ...popup,
      value,
      onSelect,
      getLabel,
      registerOption,
      unregisterOption,
      searchable: isSearchable,
      searchQuery,
      setSearchQuery,
      filterItems,
    }),
    [
      popup,
      value,
      onSelect,
      getLabel,
      registerOption,
      unregisterOption,
      isSearchable,
      searchQuery,
      setSearchQuery,
      filterItems,
    ]
  );

  return (
    <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>
  );
}

export function useSelect() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('useSelect must be used within a Select');
  }

  return context;
}
