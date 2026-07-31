import { PaginationParams, RelativeOrder } from '../common/inputs.js';

export interface CreateTaskStateData extends RelativeOrder {
  name: string;
  color: string;
}

export interface UpdateTaskStateData {
  name?: string;
  color?: string;
  order?: RelativeOrder;
}

export interface UpdateTaskStatesOrderData {
  stateIds: string[];
}

export interface ListTaskStatesParams extends PaginationParams {
  projectId: string;
}
