'use client';

import { PropsWithChildren } from 'react';

import { Portal } from '../Portal';
import { ToastContainer } from './ToastContainer';
import { ToastProvider } from './ToastContext';

export type ToastProps = PropsWithChildren;

export function Toast({ children }: ToastProps) {
  return (
    <ToastProvider>
      {children}
      <Portal id="toast-root">
        <div id="toast-viewport">
          <ToastContainer />
        </div>
      </Portal>
    </ToastProvider>
  );
}

export {
  ToastProvider,
  ToastContext,
  useToast,
  type ToastVariant,
  type ToastInput,
  type ToastData,
  type ToastContextType,
} from './ToastContext';
export { ToastContainer } from './ToastContainer';
export { ToastItem } from './ToastItem';
