import { type MembershipRole } from "../membership/enums.js";

export type Workspace = {
    id: string;
    name: string;
};

export type WorkspaceWithMembership = Workspace & {
    role: MembershipRole;
};
