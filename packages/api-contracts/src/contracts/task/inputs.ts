import { PaginationParams, RelativeOrder } from '../common/inputs.js';

export interface CreateTaskData extends RelativeOrder {
  title: string;
  content?: string;
  dueDate?: string | null;
  stateId: string;
  ownerId?: string;
}

export interface UpdateTaskData {
  title?: string;
  content?: string;
  dueDate?: string | null;
  ownerId?: string;
  stateId?: string | null;
  order?: RelativeOrder;
  archived?: boolean;
}

export interface ListTasksParams extends PaginationParams {
  projectId: string;
  stateId?: string;
}

export interface GetBoardParams {
  projectId: string;
}
