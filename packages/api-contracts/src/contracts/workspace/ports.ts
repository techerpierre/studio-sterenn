import { Paginated } from "../common/outputs.js";
import { AddMemberData, CreateWorkspaceData, ListWorkspacesParams, UpdateWorkspaceData } from "./inputs.js";
import { Workspace, WorkspaceWithMembership } from "./outputs.js";

export interface IWorkspaceAdapter {
    create(data: CreateWorkspaceData): Promise<Workspace>;
    update(id: string, data: UpdateWorkspaceData): Promise<Workspace | null>;
    list(params: ListWorkspacesParams): Promise<Paginated<WorkspaceWithMembership>>;
    addMember(workspaceId: string, data: AddMemberData): Promise<void>;
    revokeMember(workspaceId: string, memberId: string): Promise<void>;
}