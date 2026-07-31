import {
  CreateProjectData,
  IProjectAdapter,
  ListProjectsParams,
  Paginated,
  Project,
  UpdateProjectData,
} from "@sterenn/api-contracts";

export class ProjectService {
  constructor(private readonly projectAdapter: IProjectAdapter) {}

  async create(data: CreateProjectData): Promise<Project> {
    return this.projectAdapter.create(data);
  }

  async get(id: string): Promise<Project | null> {
    return this.projectAdapter.get(id);
  }

  async update(
    id: string,
    data: UpdateProjectData,
  ): Promise<Project | null> {
    return this.projectAdapter.update(id, data);
  }

  async list(params: ListProjectsParams): Promise<Paginated<Project>> {
    return this.projectAdapter.list(params);
  }

  async delete(id: string): Promise<void> {
    return this.projectAdapter.delete(id);
  }
}
