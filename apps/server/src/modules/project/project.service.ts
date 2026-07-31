import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Project as PrismaProject,
  Prisma,
} from '@/generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { Paginated } from '../common/common.types';
import { MembershipService } from '../membership/membership.service';
import { MembershipRole } from '../membership/membership.types';
import {
  CreateProjectData,
  CreateProjectParams,
  DeleteProjectParams,
  GetProjectParams,
  ListProjectsParams,
  Project,
  UpdateProjectData,
  UpdateProjectParams,
} from './project.types';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipService: MembershipService,
  ) {}

  async create(
    data: CreateProjectData,
    params?: CreateProjectParams,
  ): Promise<Project> {
    if (params?.sessionUserId) {
      await this.membershipService.assertRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        workspaceId: data.workspaceId,
      });
    }

    const createdProject = await this.prisma.project.create({
      data: {
        name: data.name,
        slug: data.slug,
        workspaceId: data.workspaceId,
      },
    });

    return this.toProject(createdProject);
  }

  async get(
    id: string,
    params?: GetProjectParams,
  ): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) return null;

    if (params?.sessionUserId) {
      await this.membershipService.assertMember({
        userId: params.sessionUserId,
        workspaceId: project.workspaceId,
      });
    }

    return this.toProject(project);
  }

  async update(
    id: string,
    data: UpdateProjectData,
    params?: UpdateProjectParams,
  ): Promise<Project | null> {
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException();

    if (params?.sessionUserId) {
      await this.membershipService.assertRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        workspaceId: existing.workspaceId,
      });
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data,
    });

    return updatedProject ? this.toProject(updatedProject) : null;
  }

  async list(params: ListProjectsParams): Promise<Paginated<Project>> {
    if (params.userId) {
      await this.membershipService.assertMember({
        userId: params.userId,
        workspaceId: params.workspaceId,
      });
    }

    const where: Prisma.ProjectWhereInput = {
      workspaceId: params.workspaceId,
    };

    const [projects, count] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip: params.page * params.take,
        take: params.take,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      results: projects.map(this.toProject),
      count,
    };
  }

  async delete(id: string, params?: DeleteProjectParams): Promise<void> {
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException();

    if (params?.sessionUserId) {
      await this.membershipService.assertRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        workspaceId: existing.workspaceId,
      });
    }

    await this.prisma.project.delete({
      where: { id },
    });
  }

  private toProject(data: PrismaProject): Project {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      workspaceId: data.workspaceId,
    };
  }
}
