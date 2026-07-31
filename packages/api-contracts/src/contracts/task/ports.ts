import { Paginated } from '../common/outputs.js';
import {
  CreateTaskData,
  GetBoardParams,
  ListTasksParams,
  UpdateTaskData,
} from './inputs.js';
import { Board, Task } from './outputs.js';

export interface ITaskAdapter {
  list(params: ListTasksParams): Promise<Paginated<Task>>;
  create(projectId: string, data: CreateTaskData): Promise<Task>;
  get(taskId: string): Promise<Task | null>;
  getBoard(params: GetBoardParams): Promise<Board>;
  update(taskId: string, data: UpdateTaskData): Promise<Task | null>;
  delete(taskId: string): Promise<void>;
}
