import httpClient from "@/config/httpClient";
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

export class TaskAdapter implements ITaskAdapter {
  async list(params: ListTasksParams): Promise<Paginated<Task>> {
    const { projectId, ...query } = params;

    return httpClient.get(`/projects/${projectId}/tasks`, {
      params: query,
    });
  }

  async create(projectId: string, data: CreateTaskData): Promise<Task> {
    return httpClient.post(`/projects/${projectId}/tasks`, data);
  }

  async get(taskId: string): Promise<Task | null> {
    return httpClient.get(`/tasks/${taskId}`);
  }

  async getBoard(params: GetBoardParams): Promise<Board> {
    return httpClient.get(`/projects/${params.projectId}/board`);
  }

  async update(
    taskId: string,
    data: UpdateTaskData,
  ): Promise<Task | null> {
    return httpClient.patch(`/tasks/${taskId}`, data);
  }

  async delete(taskId: string): Promise<void> {
    return httpClient.delete(`/tasks/${taskId}`);
  }
}
