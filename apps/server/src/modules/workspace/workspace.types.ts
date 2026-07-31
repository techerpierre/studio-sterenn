import { PaginationParams, SessionUserParam } from '../common/common.types';
import { MembershipRole } from '../membership/membership.types';

export { MembershipRole };

export type Workspace = {
  id: string;
  name: string;
};

export type WorkspaceWithMembership = Workspace & {
  role: MembershipRole;
};

export type CreateWorkspaceData = {
  ownerId: string;
  name: string;
};

export type UpdateWorkspaceData = {
  name?: string;
};

export type UpdateWorkspaceParams = SessionUserParam;

export type ListWorkspacesParams = PaginationParams;

export type ListWorkspacesParamsWithUser = ListWorkspacesParams & {
  userId: string;
};

export type AddMemberData = {
  memberId: string;
  role: MembershipRole;
};

export type AddMemberParams = SessionUserParam;

export type RevokeMemberData = {
  memberId: string;
};

export type RevokeMemberParams = SessionUserParam;
