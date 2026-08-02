'use client';

import { Board, Task, TaskState } from '@sterenn/api-contracts';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { getBoard } from '@/actions/task.actions';
import {
  applyItemsOrder as applyItemsOrderToBoard,
  type BoardItems,
  insertState as insertStateIntoBoard,
  patchTask as patchTaskIntoBoard,
  removeTask as removeTaskFromBoard,
  upsertState as upsertStateIntoBoard,
  upsertTask as upsertTaskIntoBoard,
} from '@/utils/boardState';

export type BoardFilters = {
  ownerId?: string;
  tags?: string[];
};

export type BoardContextType = {
  board: Board;
  setBoard: Dispatch<SetStateAction<Board>>;
  filters: BoardFilters;
  upsertTask: (task: Task) => void;
  patchTask: (taskId: string, patch: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  upsertState: (state: TaskState) => void;
  insertState: (state: TaskState) => void;
  applyItemsOrder: (items: BoardItems) => void;
  refreshBoard: (nextFilters?: BoardFilters) => Promise<void>;
};

export const BoardContext = createContext<BoardContextType | null>(null);

export type BoardProviderProps = PropsWithChildren<{
  initialBoard: Board;
  projectId: string;
}>;

export function BoardProvider({
  children,
  initialBoard,
  projectId,
}: BoardProviderProps) {
  const [board, setBoard] = useState(initialBoard);
  const [filters, setFilters] = useState<BoardFilters>({});

  const upsertTask = useCallback((task: Task) => {
    setBoard((current) => upsertTaskIntoBoard(current, task));
  }, []);

  const patchTask = useCallback((taskId: string, patch: Partial<Task>) => {
    setBoard((current) => patchTaskIntoBoard(current, taskId, patch));
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setBoard((current) => removeTaskFromBoard(current, taskId));
  }, []);

  const upsertState = useCallback((state: TaskState) => {
    setBoard((current) => upsertStateIntoBoard(current, state));
  }, []);

  const insertState = useCallback((state: TaskState) => {
    setBoard((current) => insertStateIntoBoard(current, state));
  }, []);

  const applyItemsOrder = useCallback((items: BoardItems) => {
    setBoard((current) => applyItemsOrderToBoard(current, items));
  }, []);

  const refreshBoard = useCallback(
    async (nextFilters?: BoardFilters) => {
      const applied = nextFilters ?? filters;
      if (nextFilters !== undefined) {
        setFilters(nextFilters);
      }
      const next = await getBoard(projectId, {
        ...(applied.ownerId ? { ownerId: applied.ownerId } : {}),
        ...(applied.tags?.length ? { tags: applied.tags } : {}),
      });
      setBoard(next);
    },
    [filters, projectId],
  );

  const value = useMemo(
    () => ({
      board,
      setBoard,
      filters,
      upsertTask,
      patchTask,
      removeTask,
      upsertState,
      insertState,
      applyItemsOrder,
      refreshBoard,
    }),
    [
      board,
      filters,
      upsertTask,
      patchTask,
      removeTask,
      upsertState,
      insertState,
      applyItemsOrder,
      refreshBoard,
    ],
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }

  return context;
}
