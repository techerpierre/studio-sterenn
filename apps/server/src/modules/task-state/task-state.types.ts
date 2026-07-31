import {
  PaginationParams,
  RelativeOrder,
  SessionUserParam,
} from '../common/common.types';

export type TaskState = {
  id: string;
  name: string;
  position: number;
  color: string;
  projectId: string;
};

export type CreateTaskStateData = {
  name: string;
  color: string;
  projectId: string;
} & RelativeOrder;

export type UpdateTaskStateData = {
  name?: string;
  color?: string;
  /** Si absent, l'ordre de l'item n'est pas modifié. */
  order?: RelativeOrder;
};

export type UpdateTaskStatesOrderData = {
  stateIds: string[];
};

export type CreateTaskStateParams = SessionUserParam;

export type GetTaskStateParams = SessionUserParam;

export type UpdateTaskStateParams = SessionUserParam;

export type UpdateTaskStatesOrderParams = SessionUserParam;

export type DeleteTaskStateParams = SessionUserParam;

export type ListTaskStatesParams = PaginationParams & {
  projectId: string;
  userId?: string;
};
