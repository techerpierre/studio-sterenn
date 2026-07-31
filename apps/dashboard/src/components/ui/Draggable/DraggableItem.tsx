'use client';

import type { UniqueIdentifier } from '@dnd-kit/abstract';
import { SortableKeyboardPlugin } from '@dnd-kit/dom/sortable';
import { useSortable } from '@dnd-kit/react/sortable';
import clsx from '@/lib/clsx';
import { type HTMLAttributes, type ReactNode } from 'react';

import { useDraggableList } from './DraggableContext';

export type DraggableItemProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'id'
> & {
  children: ReactNode;
  id: UniqueIdentifier;
  index: number;
  disabled?: boolean;
};

export function DraggableItem({
  children,
  id,
  index,
  disabled,
  className,
  style,
  ...props
}: DraggableItemProps) {
  const list = useDraggableList();
  const { ref, isDragging } = useSortable({
    id,
    index,
    group: list.id,
    type: list.type,
    accept: list.type,
    disabled,
    // Sans OptimisticSortingPlugin : il déplace le DOM hors de React
    // (removeChild / useInsertionEffect). Le layout passe par le state React.
    plugins: [SortableKeyboardPlugin],
  });

  return (
    <div
      ref={ref}
      data-dragging={isDragging || undefined}
      className={clsx(className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
