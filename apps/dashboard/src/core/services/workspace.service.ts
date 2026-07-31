import {
  CreateWorkspaceData,
  AddMemberData,
  UpdateWorkspaceData,
  Workspace,
  ListWorkspacesParams,
  IWorkspaceAdapter,
  Paginated,
  WorkspaceWithMembership,
} from "@sterenn/api-contracts";

export class WorkspaceService {
  constructor(private readonly workspaceAdapter: IWorkspaceAdapter) {}

  async create(data: CreateWorkspaceData): Promise<Workspace> {
    return this.workspaceAdapter.create(data);
  }

  async update(
    id: string,
    data: UpdateWorkspaceData,
  ): Promise<Workspace | null> {
    return this.workspaceAdapter.update(id, data);
  }

  async list(
    params: ListWorkspacesParams,
  ): Promise<Paginated<WorkspaceWithMembership>> {
    return this.workspaceAdapter.list(params);
  }

  async addMember(workspaceId: string, data: AddMemberData): Promise<void> {
    return this.workspaceAdapter.addMember(workspaceId, data);
  }

  async revokeMember(workspaceId: string, memberId: string): Promise<void> {
    return this.workspaceAdapter.revokeMember(workspaceId, memberId);
  }
}
