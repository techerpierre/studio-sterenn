'use client';

import { move } from '@dnd-kit/helpers';
import { Board, Task } from '@sterenn/api-contracts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { updateTask } from '@/actions/task.actions';
import { useActionFeedback } from '@/hooks/useActionFeedback';
import {
  boardToItems,
  collectTasks,
  resolveTaskMoveOrder,
  type BoardItems,
} from '@/utils/boardState';

export type UseBoardDragPersistOptions = {
  board: Board;
  applyItemsOrder: (items: BoardItems) => void;
};

export type UseBoardDragPersistResult = {
  items: BoardItems;
  taskById: Map<string, Task>;
  isPersisting: boolean;
  onDragStart: () => void;
  onDragOver: (event: Parameters<typeof move>[1]) => void;
  onDragEnd: (event: { canceled: boolean; operation: { source?: { id?: string | number | null } | null } }) => void;
};

export function useBoardDragPersist({
  board,
  applyItemsOrder,
}: UseBoardDragPersistOptions): UseBoardDragPersistResult {
  const { run } = useActionFeedback();
  const [items, setItems] = useState<BoardItems>(() =>
    boardToItems(board.states),
  );
  const [isPersisting, setIsPersisting] = useState(false);
  const itemsRef = useRef(items);
  const previousItems = useRef(items);
  const taskById = useMemo(() => collectTasks(board.states), [board.states]);

  useEffect(() => {
    const next = boardToItems(board.states);
    setItems(next);
    itemsRef.current = next;
  }, [board]);

  const persistMove = useCallback(
    async (nextItems: BoardItems, taskId: string) => {
      const moveOrder = resolveTaskMoveOrder(nextItems, taskId);
      if (!moveOrder) return;

      const { stateId, beforeId, afterId } = moveOrder;

      setIsPersisting(true);
      const ok = await run(
        async () => {
          await updateTask(taskId, {
            stateId,
            order: {
              ...(beforeId ? { beforeId } : {}),
              ...(afterId ? { afterId } : {}),
            },
          });
          return true;
        },
        {
          errorTitle: 'Déplacement échoué',
          errorDescription: 'Impossible de déplacer la tâche.',
        },
      );
      setIsPersisting(false);

      if (ok) {
        applyItemsOrder(nextItems);
        return;
      }

      setItems(previousItems.current);
      itemsRef.current = previousItems.current;
    },
    [applyItemsOrder, run],
  );

  const onDragStart = useCallback(() => {
    previousItems.current = structuredClone(itemsRef.current);
  }, []);

  const onDragOver = useCallback((event: Parameters<typeof move>[1]) => {
    setItems((current) => {
      const next = move(current, event);
      itemsRef.current = next;
      return next;
    });
  }, []);

  const onDragEnd = useCallback(
    (event: {
      canceled: boolean;
      operation: { source?: { id?: string | number | null } | null };
    }) => {
      if (event.canceled) {
        setItems(previousItems.current);
        itemsRef.current = previousItems.current;
        return;
      }

      const sourceId = event.operation.source?.id;
      if (typeof sourceId !== 'string') return;

      void persistMove(itemsRef.current, sourceId);
    },
    [persistMove],
  );

  return {
    items,
    taskById,
    isPersisting,
    onDragStart,
    onDragOver,
    onDragEnd,
  };
}
