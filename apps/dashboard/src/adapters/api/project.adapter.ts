import httpClient from "@/config/httpClient";
import {
  CreateProjectData,
  IProjectAdapter,
  ListProjectsParams,
  Paginated,
  Project,
  UpdateProjectData,
} from "@sterenn/api-contracts";

export class ProjectAdapter implements IProjectAdapter {
  async create(data: CreateProjectData): Promise<Project> {
    return httpClient.post("/projects", data);
  }

  async get(id: string): Promise<Project | null> {
    return httpClient.get(`/projects/${id}`);
  }

  async update(
    id: string,
    data: UpdateProjectData,
  ): Promise<Project | null> {
    return httpClient.patch(`/projects/${id}`, data);
  }

  async list(params: ListProjectsParams): Promise<Paginated<Project>> {
    return httpClient.get("/projects", { params });
  }

  async delete(id: string): Promise<void> {
    return httpClient.delete(`/projects/${id}`);
  }
}
