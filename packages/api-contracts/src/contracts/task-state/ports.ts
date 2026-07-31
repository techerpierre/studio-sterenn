import { Paginated } from '../common/outputs.js';
import {
  CreateTaskStateData,
  ListTaskStatesParams,
  UpdateTaskStatesOrderData,
  UpdateTaskStateData,
} from './inputs.js';
import { TaskState } from './outputs.js';

export interface ITaskStateAdapter {
  list(params: ListTaskStatesParams): Promise<Paginated<TaskState>>;
  create(projectId: string, data: CreateTaskStateData): Promise<TaskState>;
  update(
    stateId: string,
    data: UpdateTaskStateData,
  ): Promise<TaskState | null>;
  updateOrder(
    projectId: string,
    data: UpdateTaskStatesOrderData,
  ): Promise<TaskState[]>;
  delete(stateId: string): Promise<void>;
}
