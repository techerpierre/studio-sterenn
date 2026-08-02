import { Board, BoardState, Task, TaskState } from '@sterenn/api-contracts';

export type BoardItems = Record<string, string[]>;

export type TaskMoveOrder = {
  stateId: string;
  beforeId?: string;
  afterId?: string;
};

export function boardToItems(states: BoardState[]): BoardItems {
  return Object.fromEntries(
    states.map((state) => [state.id, state.tasks.map((task) => task.id)]),
  );
}

export function collectTasks(states: BoardState[]): Map<string, Task> {
  const map = new Map<string, Task>();
  for (const state of states) {
    for (const task of state.tasks) {
      map.set(task.id, task);
    }
  }
  return map;
}

/** Resolve target column + neighbors for a task id in a DnD items map. */
export function resolveTaskMoveOrder(
  items: BoardItems,
  taskId: string,
): TaskMoveOrder | null {
  const stateId = Object.keys(items).find((id) => items[id].includes(taskId));
  if (!stateId) return null;

  const column = items[stateId];
  const index = column.indexOf(taskId);

  return {
    stateId,
    ...(index > 0 ? { beforeId: column[index - 1] } : {}),
    ...(index >= 0 && index < column.length - 1
      ? { afterId: column[index + 1] }
      : {}),
  };
}

function renumberTaskPositions(tasks: Task[], stateId: string): Task[] {
  return tasks.map((task, index) => ({
    ...task,
    stateId,
    position: index,
  }));
}

function renumberStatePositions(states: BoardState[]): BoardState[] {
  return states.map((state, index) => ({
    ...state,
    position: index,
  }));
}

function removeTaskFromStates(states: BoardState[], taskId: string): BoardState[] {
  return states.map((state) => ({
    ...state,
    tasks: renumberTaskPositions(
      state.tasks.filter((task) => task.id !== taskId),
      state.id,
    ),
  }));
}

/**
 * Insert or replace a task in the board according to `task.stateId` + `task.position`.
 * If `stateId` is null, the task is only removed (no longer on the board).
 */
export function upsertTask(board: Board, task: Task): Board {
  const without = removeTaskFromStates(board.states, task.id);

  if (!task.stateId) {
    return { ...board, states: without };
  }

  const states = without.map((state) => {
    if (state.id !== task.stateId) return state;

    const nextTasks = [...state.tasks];
    const index = Math.max(0, Math.min(task.position, nextTasks.length));
    nextTasks.splice(index, 0, task);
    return {
      ...state,
      tasks: renumberTaskPositions(nextTasks, state.id),
    };
  });

  return { ...board, states };
}

export function removeTask(board: Board, taskId: string): Board {
  return {
    ...board,
    states: removeTaskFromStates(board.states, taskId),
  };
}

/**
 * Merge a partial update into an existing task without reordering columns.
 */
export function patchTask(
  board: Board,
  taskId: string,
  patch: Partial<Task>,
): Board {
  return {
    ...board,
    states: board.states.map((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...patch } : task,
      ),
    })),
  };
}

export function upsertState(board: Board, state: TaskState): Board {
  const states = board.states.map((current) => {
    if (current.id !== state.id) return current;
    return {
      ...current,
      name: state.name,
      color: state.color,
      position: state.position,
      projectId: state.projectId,
    };
  });

  return {
    ...board,
    states: renumberStatePositions(
      [...states].sort((a, b) => a.position - b.position),
    ),
  };
}

export function insertState(board: Board, state: TaskState): Board {
  if (board.states.some((current) => current.id === state.id)) {
    return upsertState(board, state);
  }

  const nextState: BoardState = {
    id: state.id,
    name: state.name,
    color: state.color,
    projectId: state.projectId,
    position: state.position,
    tasks: [],
  };

  const index = Math.max(0, Math.min(state.position, board.states.length));
  const states = [...board.states];
  states.splice(index, 0, nextState);

  return {
    ...board,
    states: renumberStatePositions(states),
  };
}

/**
 * Reorder tasks in each column from a DnD items map, preserving task data.
 */
export function applyItemsOrder(board: Board, items: BoardItems): Board {
  const taskById = new Map<string, Task>();
  for (const state of board.states) {
    for (const task of state.tasks) {
      taskById.set(task.id, task);
    }
  }

  const states = board.states.map((state) => {
    const orderedIds = items[state.id] ?? state.tasks.map((task) => task.id);
    const tasks = orderedIds
      .map((id) => taskById.get(id))
      .filter((task): task is Task => Boolean(task));

    return {
      ...state,
      tasks: renumberTaskPositions(tasks, state.id),
    };
  });

  return { ...board, states };
}
