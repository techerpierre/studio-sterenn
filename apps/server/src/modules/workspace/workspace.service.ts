import { Injectable } from '@nestjs/common';
import {
  Workspace as PrismaWorkspace,
  Prisma,
} from '@/generated/prisma/client';

import { Paginated } from '../common/common.types';
import { MembershipService } from '../membership/membership.service';
import { MembershipRole } from '../membership/membership.types';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddMemberData,
  AddMemberParams,
  CreateWorkspaceData,
  ListWorkspacesParams,
  ListWorkspacesParamsWithUser,
  RevokeMemberData,
  RevokeMemberParams,
  UpdateWorkspaceData,
  UpdateWorkspaceParams,
  Workspace,
  WorkspaceWithMembership,
} from './workspace.types';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipService: MembershipService,
  ) {}

  async create(data: CreateWorkspaceData): Promise<Workspace> {
    const { ownerId, ...createData } = data;

    const createdWorkspace = await this.prisma.workspace.create({
      data: createData,
    });

    await this.membershipService.create({
      role: MembershipRole.ADMIN,
      userId: ownerId,
      workspaceId: createdWorkspace.id,
    });

    return this.toWorkspace(createdWorkspace);
  }

  async update(
    id: string,
    data: UpdateWorkspaceData,
    params?: UpdateWorkspaceParams,
  ): Promise<Workspace | null> {
    if (params?.sessionUserId) {
      await this.membershipService.assertRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        workspaceId: id,
      });
    }

    const updatedWorkspace = await this.prisma.workspace.update({
      where: { id },
      data,
    });

    return updatedWorkspace ? this.toWorkspace(updatedWorkspace) : null;
  }

  async list(
    params: ListWorkspacesParamsWithUser,
  ): Promise<Paginated<WorkspaceWithMembership>>;
  async list(params: ListWorkspacesParams): Promise<Paginated<Workspace>>;
  async list(
    params: ListWorkspacesParams | ListWorkspacesParamsWithUser,
  ): Promise<Paginated<WorkspaceWithMembership | Workspace>> {
    const where: Prisma.WorkspaceWhereInput = {
      memberships: {
        some: { userId: 'userId' in params ? params.userId : undefined },
      },
    };

    const [workspaces, count] = await this.prisma.$transaction([
      this.prisma.workspace.findMany({
        where,
        skip: params.page * params.take,
        take: params.take,
        include: {
          memberships: true,
        },
      }),
      this.prisma.workspace.count({ where }),
    ]);

    return {
      results: workspaces.map((workspace) => ({
        ...this.toWorkspace(workspace),
        role: workspace.memberships[0].role,
      })),
      count,
    };
  }

  async addMember(
    workspaceId: string,
    data: AddMemberData,
    params?: AddMemberParams,
  ): Promise<void> {
    if (params?.sessionUserId) {
      await this.membershipService.assertRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        workspaceId,
      });
    }

    await this.membershipService.create({
      role: data.role,
      userId: data.memberId,
      workspaceId,
    });
  }

  async revokeMember(
    workspaceId: string,
    data: RevokeMemberData,
    params: RevokeMemberParams,
  ): Promise<void> {
    if (params?.sessionUserId) {
      await this.membershipService.assertRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        workspaceId,
      });
    }

    await this.membershipService.delete({
      userId: data.memberId,
      workspaceId,
    });
  }

  private toWorkspace(data: PrismaWorkspace): Workspace {
    return {
      id: data.id,
      name: data.name,
    };
  }
}
