import {
  CreateTaskStateData,
  ITaskStateAdapter,
  ListTaskStatesParams,
  Paginated,
  TaskState,
  UpdateTaskStateData,
  UpdateTaskStatesOrderData,
} from "@sterenn/api-contracts";

export class TaskStateService {
  constructor(private readonly taskStateAdapter: ITaskStateAdapter) {}

  async list(params: ListTaskStatesParams): Promise<Paginated<TaskState>> {
    return this.taskStateAdapter.list(params);
  }

  async create(
    projectId: string,
    data: CreateTaskStateData,
  ): Promise<TaskState> {
    return this.taskStateAdapter.create(projectId, data);
  }

  async update(
    stateId: string,
    data: UpdateTaskStateData,
  ): Promise<TaskState | null> {
    return this.taskStateAdapter.update(stateId, data);
  }

  async updateOrder(
    projectId: string,
    data: UpdateTaskStatesOrderData,
  ): Promise<TaskState[]> {
    return this.taskStateAdapter.updateOrder(projectId, data);
  }

  async delete(stateId: string): Promise<void> {
    return this.taskStateAdapter.delete(stateId);
  }
}
