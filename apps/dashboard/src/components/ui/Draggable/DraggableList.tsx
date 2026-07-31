'use client';

import { CollisionPriority } from '@dnd-kit/abstract';
import type { UniqueIdentifier } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import clsx from '@/lib/clsx';
import { toCssSize } from '@/lib/utils';
import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import {
  DraggableListProvider,
  type DraggableOrientation,
} from './DraggableContext';
import styles from './DraggableList.module.css';

export type DraggableListProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'id'
> & {
  children: ReactNode;
  id: UniqueIdentifier;
  orientation?: DraggableOrientation;
  gap?: number | string;
  /** Type accepted by this droppable list. Defaults to `"item"`. */
  accept?: string | number | Array<string | number>;
  /** Shared sortable type for items in this list. Defaults to `"item"`. */
  type?: string | number;
};

export function DraggableList({
  children,
  id,
  orientation = 'vertical',
  gap,
  accept = 'item',
  type = 'item',
  className,
  style,
  ...props
}: DraggableListProps) {
  const { ref, isDropTarget } = useDroppable({
    id,
    type: 'list',
    accept,
    collisionPriority: CollisionPriority.Low,
  });

  const listStyle: CSSProperties = {
    ...(gap !== undefined ? { gap: toCssSize(gap) } : null),
    ...style,
  };

  return (
    <DraggableListProvider id={id} orientation={orientation} type={type}>
      <div
        ref={ref}
        data-orientation={orientation}
        data-drop-target={isDropTarget || undefined}
        className={clsx(
          styles.list,
          orientation === 'vertical' ? styles.vertical : styles.horizontal,
          className,
        )}
        style={listStyle}
        {...props}
      >
        {children}
      </div>
    </DraggableListProvider>
  );
}
