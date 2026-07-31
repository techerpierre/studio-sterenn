'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

import { usePopupState, type PopupState } from '@/lib/popup';

export type DropdownContextType = PopupState;

export const DropdownContext = createContext<DropdownContextType | null>(null);

export function DropdownProvider({ children }: PropsWithChildren) {
  const value = usePopupState();

  return (
    <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>
  );
}

export function useDropdown() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }

  return context;
}
