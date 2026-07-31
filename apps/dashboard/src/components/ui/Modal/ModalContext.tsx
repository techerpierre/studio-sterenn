'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

import { usePopupState, type PopupState } from '@/lib/popup';

export type ModalContextType = PopupState;

export const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: PropsWithChildren) {
  const value = usePopupState();

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a Modal');
  }

  return context;
}
