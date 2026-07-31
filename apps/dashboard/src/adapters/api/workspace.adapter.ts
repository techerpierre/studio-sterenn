import httpClient from "@/config/httpClient";
import {
  CreateWorkspaceData,
  AddMemberData,
  Workspace,
  Paginated,
  IWorkspaceAdapter,
  ListWorkspacesParams,
  UpdateWorkspaceData,
  WorkspaceWithMembership,
} from "@sterenn/api-contracts";

export class WorkspaceAdapter implements IWorkspaceAdapter {
  async create(data: CreateWorkspaceData): Promise<Workspace> {
    return httpClient.post("/workspaces", data);
  }

  async update(
    id: string,
    data: UpdateWorkspaceData,
  ): Promise<Workspace | null> {
    return httpClient.put(`/workspaces/${id}`, data);
  }

  async list(params: ListWorkspacesParams): Promise<Paginated<WorkspaceWithMembership>> {
    return httpClient.get("/workspaces", { params });
  }

  async addMember(workspaceId: string, data: AddMemberData): Promise<void> {
    return httpClient.post(`/workspaces/${workspaceId}/members`, data);
  }

  async revokeMember(workspaceId: string, memberId: string): Promise<void> {
    return httpClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  }
}
