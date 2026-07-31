import httpClient from "@/config/httpClient";
import {
  CreateTaskStateData,
  ITaskStateAdapter,
  ListTaskStatesParams,
  Paginated,
  TaskState,
  UpdateTaskStateData,
  UpdateTaskStatesOrderData,
} from "@sterenn/api-contracts";

export class TaskStateAdapter implements ITaskStateAdapter {
  async list(params: ListTaskStatesParams): Promise<Paginated<TaskState>> {
    const { projectId, ...pagination } = params;

    return httpClient.get(`/projects/${projectId}/states`, {
      params: pagination,
    });
  }

  async create(
    projectId: string,
    data: CreateTaskStateData,
  ): Promise<TaskState> {
    return httpClient.post(`/projects/${projectId}/states`, data);
  }

  async update(
    stateId: string,
    data: UpdateTaskStateData,
  ): Promise<TaskState | null> {
    return httpClient.patch(`/task-states/${stateId}`, data);
  }

  async updateOrder(
    projectId: string,
    data: UpdateTaskStatesOrderData,
  ): Promise<TaskState[]> {
    return httpClient.put(`/projects/${projectId}/states/order`, data);
  }

  async delete(stateId: string): Promise<void> {
    return httpClient.delete(`/task-states/${stateId}`);
  }
}
