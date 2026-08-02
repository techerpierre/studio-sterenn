import {
  PaginationParams,
  RelativeOrder,
  SessionUserParam,
} from '../common/common.types';
import { Tag } from '../tag/tag.types';

export type TaskTag = Tag;

type TaskOwner = {
  id: string;
  firstName: string;
  lastName: string;
}

export type Task = {
  id: string;
  title: string;
  content: string;
  dueDate: Date | null;
  position: number;
  projectId: string;
  ownerId: string;
  stateId: string | null;
  tags: TaskTag[];
  owner: TaskOwner;
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
  ownerId?: string;
  tags?: string[];
};

export enum TaskExportType {
  MARKDOWN = 'markdown',
  JSON = 'json',
}

export type TaskExportParams = {
  userId?: string;
  projectId: string;
  type: TaskExportType;
};

export type TaskExportResult = {
  ressourceUrl: string;
};

export enum TaskExportEventStatus {
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

export type TaskExportSseEvent = {
  status: TaskExportEventStatus;
  ressourceUrl: string | null;
  message?: string;
};
