import { WorkspaceWithMembership } from "@sterenn/api-contracts";

export type WorkspaceSelectorData = {
  workspaces: WorkspaceWithMembership[];
  count: number;
  currentWorkspace: WorkspaceWithMembership | null;
  shouldPersistCurrent: boolean;
};
