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
  removeTask as removeTaskFromBoard,
  upsertState as upsertStateIntoBoard,
  upsertTask as upsertTaskIntoBoard,
} from '@/utils/boardState';

export type BoardContextType = {
  board: Board;
  setBoard: Dispatch<SetStateAction<Board>>;
  upsertTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  upsertState: (state: TaskState) => void;
  insertState: (state: TaskState) => void;
  applyItemsOrder: (items: BoardItems) => void;
  refreshBoard: () => Promise<void>;
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

  const upsertTask = useCallback((task: Task) => {
    setBoard((current) => upsertTaskIntoBoard(current, task));
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

  const refreshBoard = useCallback(async () => {
    const next = await getBoard(projectId);
    setBoard(next);
  }, [projectId]);

  const value = useMemo(
    () => ({
      board,
      setBoard,
      upsertTask,
      removeTask,
      upsertState,
      insertState,
      applyItemsOrder,
      refreshBoard,
    }),
    [
      board,
      upsertTask,
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
