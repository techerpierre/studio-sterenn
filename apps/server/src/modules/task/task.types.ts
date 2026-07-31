import {
  PaginationParams,
  RelativeOrder,
  SessionUserParam,
} from '../common/common.types';

export type Task = {
  id: string;
  title: string;
  content: string;
  dueDate: Date | null;
  position: number;
  projectId: string;
  ownerId: string;
  stateId: string | null;
};

export type CreateTaskData = {
  title: string;
  content?: string;
  dueDate?: Date | null;
  projectId: string;
  stateId: string;
  ownerId: string;
} & RelativeOrder;

export type UpdateTaskData = {
  title?: string;
  content?: string;
  dueDate?: Date | null;
  ownerId?: string;
  /** `null` retire la tâche du board (plus de colonne). */
  stateId?: string | null;
  /** Si absent, l'ordre de la task n'est pas modifié. */
  order?: RelativeOrder;
  archived?: boolean;
};

export type CreateTaskParams = SessionUserParam;

export type GetTaskParams = SessionUserParam;

export type UpdateTaskParams = SessionUserParam;

export type DeleteTaskParams = SessionUserParam;

export type ListTasksParams = PaginationParams & {
  projectId: string;
  stateId?: string;
  userId?: string;
};

export type BoardState = {
  id: string;
  name: string;
  position: number;
  color: string;
  projectId: string;
  tasks: Task[];
};

export type Board = {
  projectId: string;
  states: BoardState[];
};

export type GetBoardParams = SessionUserParam & {
  projectId: string;
};
