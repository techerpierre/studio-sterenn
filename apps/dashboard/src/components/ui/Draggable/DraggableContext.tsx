'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/abstract';

export type DraggableOrientation = 'vertical' | 'horizontal';

export type DraggableListContextType = {
  id: UniqueIdentifier;
  orientation: DraggableOrientation;
  type: string | number;
};

const DraggableListContext = createContext<DraggableListContextType | null>(
  null,
);

export function DraggableListProvider({
  id,
  orientation,
  type,
  children,
}: DraggableListContextType & { children: ReactNode }) {
  return (
    <DraggableListContext.Provider value={{ id, orientation, type }}>
      {children}
    </DraggableListContext.Provider>
  );
}

export function useDraggableList() {
  const context = useContext(DraggableListContext);
  if (!context) {
    throw new Error('Draggable.Item must be used within Draggable.List');
  }
  return context;
}
