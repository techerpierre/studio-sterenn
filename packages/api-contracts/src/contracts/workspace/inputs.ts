import { PaginationParams } from "../common/inputs.js";
import { type MembershipRole } from "../membership/enums.js";

export interface CreateWorkspaceData {
    name: string;
}

export interface UpdateWorkspaceData {
    name: string;
}

export interface ListWorkspacesParams extends PaginationParams {}

export interface AddMemberData {
    role: MembershipRole;
    memberId: string;
}
