import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskState as PrismaTaskState } from '@/generated/prisma/client';
import {
  generateKeyBetween,
  generateNKeysBetween,
} from 'fractional-indexing';

import { Paginated, RelativeOrder } from '../common/common.types';
import { MembershipService } from '../membership/membership.service';
import { MembershipRole } from '../membership/membership.types';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskStateData,
  CreateTaskStateParams,
  DeleteTaskStateParams,
  GetTaskStateParams,
  ListTaskStatesParams,
  UpdateTaskStatesOrderData,
  UpdateTaskStatesOrderParams,
  TaskState,
  UpdateTaskStateData,
  UpdateTaskStateParams,
} from './task-state.types';

@Injectable()
export class TaskStateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipService: MembershipService,
  ) {}

  async create(
    data: CreateTaskStateData,
    params?: CreateTaskStateParams,
  ): Promise<TaskState> {
    if (params?.sessionUserId) {
      await this.membershipService.assertProjectRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        projectId: data.projectId,
      });
    }

    const rank = await this.resolveRankFromOrder(data.projectId, {
      beforeId: data.beforeId,
      afterId: data.afterId,
    });

    const created = await this.prisma.taskState.create({
      data: {
        name: data.name,
        color: data.color,
        projectId: data.projectId,
        rank,
      },
    });

    return this.toTaskState(
      created,
      await this.resolvePosition(created.projectId, created.rank),
    );
  }

  async get(
    id: string,
    params?: GetTaskStateParams,
  ): Promise<TaskState | null> {
    const state = await this.prisma.taskState.findUnique({
      where: { id },
    });

    if (!state) return null;

    if (params?.sessionUserId) {
      await this.membershipService.assertProjectMember({
        userId: params.sessionUserId,
        projectId: state.projectId,
      });
    }

    return this.toTaskState(
      state,
      await this.resolvePosition(state.projectId, state.rank),
    );
  }

  async update(
    id: string,
    data: UpdateTaskStateData,
    params?: UpdateTaskStateParams,
  ): Promise<TaskState | null> {
    const existing = await this.prisma.taskState.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException();

    if (params?.sessionUserId) {
      await this.membershipService.assertProjectRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        projectId: existing.projectId,
      });
    }

    const rank = data.order
      ? await this.resolveRankFromOrder(existing.projectId, data.order, id)
      : undefined;

    const updated = await this.prisma.taskState.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color,
        ...(rank !== undefined && { rank }),
      },
    });

    return updated
      ? this.toTaskState(
          updated,
          await this.resolvePosition(updated.projectId, updated.rank),
        )
      : null;
  }

  async updateOrder(
    projectId: string,
    data: UpdateTaskStatesOrderData,
    params?: UpdateTaskStatesOrderParams,
  ): Promise<TaskState[]> {
    if (params?.sessionUserId) {
      await this.membershipService.assertProjectRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        projectId,
      });
    }

    const states = await this.prisma.taskState.findMany({
      where: { projectId },
    });
    const existingIds = new Set(states.map((state) => state.id));

    if (
      data.stateIds.length !== existingIds.size ||
      data.stateIds.some((stateId) => !existingIds.has(stateId))
    ) {
      throw new BadRequestException(
        'stateIds must contain exactly the project states',
      );
    }

    const ranks = generateNKeysBetween(null, null, data.stateIds.length);
    const byId = new Map(states.map((state) => [state.id, state]));

    await this.prisma.$transaction(
      data.stateIds.map((stateId, index) =>
        this.prisma.taskState.update({
          where: { id: stateId },
          data: { rank: ranks[index] },
        }),
      ),
    );

    return data.stateIds.map((stateId, index) => {
      const state = byId.get(stateId)!;
      return this.toTaskState({ ...state, rank: ranks[index] }, index);
    });
  }

  async list(params: ListTaskStatesParams): Promise<Paginated<TaskState>> {
    if (params.userId) {
      await this.membershipService.assertProjectMember({
        userId: params.userId,
        projectId: params.projectId,
      });
    }

    const where = { projectId: params.projectId };

    const [states, count] = await this.prisma.$transaction([
      this.prisma.taskState.findMany({
        where,
        skip: params.page * params.take,
        take: params.take,
        orderBy: { rank: 'asc' },
      }),
      this.prisma.taskState.count({ where }),
    ]);

    const offset = params.page * params.take;

    return {
      results: states.map((state, index) =>
        this.toTaskState(state, offset + index),
      ),
      count,
    };
  }

  async delete(id: string, params?: DeleteTaskStateParams): Promise<void> {
    const existing = await this.prisma.taskState.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException();

    if (params?.sessionUserId) {
      await this.membershipService.assertProjectRole(MembershipRole.ADMIN, {
        userId: params.sessionUserId,
        projectId: existing.projectId,
      });
    }

    await this.prisma.taskState.delete({ where: { id } });
  }

  /**
   * Resolves a rank from the neighbors.
   * - no beforeId → first (left null bound)
   * - no afterId → last (right null bound)
   */
  private async resolveRankFromOrder(
    projectId: string,
    order: RelativeOrder,
    excludeId?: string,
  ): Promise<string> {
    if (
      (order.beforeId && order.beforeId === excludeId) ||
      (order.afterId && order.afterId === excludeId)
    ) {
      throw new BadRequestException('order neighbors cannot reference self');
    }

    const [before, after] = await Promise.all([
      order.beforeId
        ? this.prisma.taskState.findFirst({
            where: { id: order.beforeId, projectId },
            select: { rank: true },
          })
        : null,
      order.afterId
        ? this.prisma.taskState.findFirst({
            where: { id: order.afterId, projectId },
            select: { rank: true },
          })
        : null,
    ]);

    if (order.beforeId && !before) {
      throw new BadRequestException('beforeId not found in project');
    }

    if (order.afterId && !after) {
      throw new BadRequestException('afterId not found in project');
    }

    return generateKeyBetween(before?.rank ?? null, after?.rank ?? null);
  }

  private async resolvePosition(
    projectId: string,
    rank: string,
  ): Promise<number> {
    return this.prisma.taskState.count({
      where: {
        projectId,
        rank: { lt: rank },
      },
    });
  }

  private toTaskState(data: PrismaTaskState, position: number): TaskState {
    return {
      id: data.id,
      name: data.name,
      position,
      color: data.color,
      projectId: data.projectId,
    };
  }
}
