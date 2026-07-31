import { PaginationParams } from '../common/common.types';
import { User } from '@/modules/user/user.types';

export enum MembershipRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

export type Member = User & {
  role: MembershipRole;
};

export type IsMembershipParams = {
  userId: string;
  workspaceId: string;
};

export type IsProjectMembershipParams = {
  userId: string;
  projectId: string;
};

export type ListMembersParams = PaginationParams & {
  workspaceId: string;
  userId?: string;
};

export type CreateMembershipData = {
  userId: string;
  workspaceId: string;
  role: MembershipRole;
};

export type DeleteMembershipData = {
  userId: string;
  workspaceId: string;
};
