import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tag as PrismaTag, Prisma } from '@/generated/prisma/client';

import { Paginated } from '../common/common.types';
import { MembershipService } from '../membership/membership.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTagData,
  CreateTagParams,
  ListTagsParams,
  Tag,
  UpdateTagData,
  UpdateTagParams,
} from './tag.types';

@Injectable()
export class TagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipService: MembershipService,
  ) {}

  async create(
    data: CreateTagData,
    params?: CreateTagParams,
  ): Promise<Tag> {
    if (params?.sessionUserId) {
      await this.membershipService.assertProjectMember({
        userId: params.sessionUserId,
        projectId: data.projectId,
      });
    }

    try {
      const created = await this.prisma.tag.create({
        data: {
          name: data.name.trim(),
          color: data.color,
          projectId: data.projectId,
        },
      });
      return this.toTag(created);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A tag with this name already exists');
      }
      throw error;
    }
  }

  async update(
    id: string,
    data: UpdateTagData,
    params?: UpdateTagParams,
  ): Promise<Tag | null> {
    const existing = await this.prisma.tag.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();

    if (params?.sessionUserId) {
      await this.membershipService.assertProjectMember({
        userId: params.sessionUserId,
        projectId: existing.projectId,
      });
    }

    try {
      const updated = await this.prisma.tag.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name.trim() }),
          ...(data.color !== undefined && { color: data.color }),
        },
      });
      return this.toTag(updated);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('A tag with this name already exists');
      }
      throw error;
    }
  }

  async list(params: ListTagsParams): Promise<Paginated<Tag>> {
    if (params.userId) {
      await this.membershipService.assertProjectMember({
        userId: params.userId,
        projectId: params.projectId,
      });
    }

    const search = params.search?.trim();
    const where: Prisma.TagWhereInput = {
      projectId: params.projectId,
      ...(search
        ? { name: { contains: search, mode: 'insensitive' } }
        : {}),
    };

    const [tags, count] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
        where,
        skip: params.page * params.take,
        take: params.take,
        orderBy: { name: 'asc' },
      }),
      this.prisma.tag.count({ where }),
    ]);

    return {
      results: tags.map((tag) => this.toTag(tag)),
      count,
    };
  }

  private toTag(data: PrismaTag): Tag {
    return {
      id: data.id,
      name: data.name,
      color: data.color,
      projectId: data.projectId,
    };
  }
}
