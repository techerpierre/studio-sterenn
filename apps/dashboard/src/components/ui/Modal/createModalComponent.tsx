'use client';

import { ComponentType } from 'react';

import { ModalProvider } from './ModalContext';

/**
 * Wraps a component with ModalProvider so `useModal()` can be used
 * in the same component that renders `<Modal />`.
 */
export function createModalComponent<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  function CreatedModalComponent(props: P) {
    return (
      <ModalProvider>
        <Component {...props} />
      </ModalProvider>
    );
  }

  const name = Component.displayName ?? Component.name ?? 'Component';
  CreatedModalComponent.displayName = `createModalComponent(${name})`;

  return CreatedModalComponent;
}
