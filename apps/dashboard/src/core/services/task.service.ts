import {
  Board,
  CreateTaskData,
  GetBoardParams,
  ITaskAdapter,
  ListTasksParams,
  Paginated,
  Task,
  UpdateTaskData,
} from "@sterenn/api-contracts";

export class TaskService {
  constructor(private readonly taskAdapter: ITaskAdapter) {}

  async list(params: ListTasksParams): Promise<Paginated<Task>> {
    return this.taskAdapter.list(params);
  }

  async create(projectId: string, data: CreateTaskData): Promise<Task> {
    return this.taskAdapter.create(projectId, data);
  }

  async get(taskId: string): Promise<Task | null> {
    return this.taskAdapter.get(taskId);
  }

  async getBoard(params: GetBoardParams): Promise<Board> {
    return this.taskAdapter.getBoard(params);
  }

  async update(
    taskId: string,
    data: UpdateTaskData,
  ): Promise<Task | null> {
    return this.taskAdapter.update(taskId, data);
  }

  async delete(taskId: string): Promise<void> {
    return this.taskAdapter.delete(taskId);
  }
}
