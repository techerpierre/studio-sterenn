import { MembershipRole } from "@sterenn/api-contracts";

export const MEMBERSHIP_ROLE_LABELS: Record<MembershipRole, string> = {
  [MembershipRole.ADMIN]: "Administrateur",
  [MembershipRole.MEMBER]: "Membre",
};
