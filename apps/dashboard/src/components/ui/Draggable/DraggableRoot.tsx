'use client';

import { DragDropProvider } from '@dnd-kit/react';
import type { ComponentProps } from 'react';

export type DraggableRootProps = ComponentProps<typeof DragDropProvider>;

export function DraggableRoot({ children, ...props }: DraggableRootProps) {
  return <DragDropProvider {...props}>{children}</DragDropProvider>;
}
