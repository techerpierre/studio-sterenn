import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MembershipRole as PrismaMembershipRole,
  User as PrismaUser,
} from '@/generated/prisma/client';

import { Paginated } from '../common/common.types';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMembershipData,
  DeleteMembershipData,
  IsMembershipParams,
  IsProjectMembershipParams,
  ListMembersParams,
  Member,
  MembershipRole,
} from './membership.types';

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async isMember(params: IsMembershipParams): Promise<boolean> {
    const membership = await this.findMembership(params);
    return !!membership;
  }

  async assertMember(params: IsMembershipParams): Promise<void> {
    const hasMembership = await this.isMember(params);
    if (!hasMembership) {
      throw new ForbiddenException();
    }
  }

  async hasRole(
    role: MembershipRole,
    params: IsMembershipParams,
  ): Promise<boolean> {
    const membership = await this.findMembership(params);
    return !!membership && membership.role === role;
  }

  async assertRole(
    role: MembershipRole,
    params: IsMembershipParams,
  ): Promise<void> {
    const hasRole = await this.hasRole(role, params);
    if (!hasRole) {
      throw new ForbiddenException();
    }
  }

  async assertProjectMember(
    params: IsProjectMembershipParams,
  ): Promise<void> {
    const workspaceId = await this.resolveProjectWorkspaceId(params.projectId);
    await this.assertMember({
      userId: params.userId,
      workspaceId,
    });
  }

  async assertProjectRole(
    role: MembershipRole,
    params: IsProjectMembershipParams,
  ): Promise<void> {
    const workspaceId = await this.resolveProjectWorkspaceId(params.projectId);
    await this.assertRole(role, {
      userId: params.userId,
      workspaceId,
    });
  }

  async list(params: ListMembersParams): Promise<Paginated<Member>> {
    if (params.userId) {
      await this.assertMember({
        userId: params.userId,
        workspaceId: params.workspaceId,
      });
    }

    const where = { workspaceId: params.workspaceId };

    const [memberships, count] = await this.prisma.$transaction([
      this.prisma.membership.findMany({
        where,
        skip: params.page * params.take,
        take: params.take,
        include: { user: true },
      }),
      this.prisma.membership.count({ where }),
    ]);

    return {
      results: memberships.map((membership) => this.toMember(membership)),
      count,
    };
  }

  async create(data: CreateMembershipData): Promise<void> {
    await this.prisma.membership.create({
      data: {
        role: data.role as PrismaMembershipRole,
        userId: data.userId,
        workspaceId: data.workspaceId,
      },
    });
  }

  async delete(data: DeleteMembershipData): Promise<void> {
    const revokedMembership = await this.prisma.membership.delete({
      where: {
        userId_workspaceId: {
          userId: data.userId,
          workspaceId: data.workspaceId,
        },
      },
    });

    if (!revokedMembership) {
      throw new NotFoundException();
    }
  }

  private findMembership(params: IsMembershipParams) {
    return this.prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId: params.userId,
          workspaceId: params.workspaceId,
        },
      },
    });
  }

  private async resolveProjectWorkspaceId(projectId: string): Promise<string> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { workspaceId: true },
    });

    if (!project) {
      throw new NotFoundException();
    }

    return project.workspaceId;
  }

  private toMember(membership: {
    role: PrismaMembershipRole;
    user: PrismaUser;
  }): Member {
    return {
      id: membership.user.id,
      email: membership.user.email,
      firstName: membership.user.firstName,
      lastName: membership.user.lastName,
      role: membership.role as MembershipRole,
    };
  }
}
