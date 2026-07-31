import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Task as PrismaTask,
  Prisma,
} from '@/generated/prisma/client';
import { generateKeyBetween } from 'fractional-indexing';

import { Paginated, RelativeOrder } from '../common/common.types';
import { MembershipService } from '../membership/membership.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskData,
  CreateTaskParams,
  DeleteTaskParams,
  GetBoardParams,
  GetTaskParams,
  ListTasksParams,
  Board,
  Task,
  UpdateTaskData,
  UpdateTaskParams,
} from './task.types';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipService: MembershipService,
  ) {}

  async create(
    data: CreateTaskData,
    params?: CreateTaskParams,
  ): Promise<Task> {
    if (params?.sessionUserId) {
      await this.membershipService.assertProjectMember({
        userId: params.sessionUserId,
        projectId: data.projectId,
      });
    }

    await this.assertStateInProject(data.stateId, data.projectId);

    const rank = await this.resolveRankFromOrder(data.stateId, {
      beforeId: data.beforeId,
      afterId: data.afterId,
    });

    const created = await this.prisma.task.create({
      data: {
        title: data.title,
        content: data.content ?? '',
        dueDate: data.dueDate ?? null,
        projectId: data.projectId,
        stateId: data.stateId,
        ownerId: data.ownerId,
        rank,
      },
    });

    return this.toTask(
      created,
      await this.resolvePosition(created.stateId, created.rank),
    );
  }

  async get(id: string, params?: GetTaskParams): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) return null;

    if (params?.sessionUserId) {
      await this.membershipService.assertProjectMember({
        userId: params.sessionUserId,
        projectId: task.projectId,
      });
    }

    return this.toTask(
      task,
      await this.resolvePosition(task.stateId, task.rank),
    );
  }

  async update(
    id: string,
    data: UpdateTaskData,
    params?: UpdateTaskParams,
  ): Promise<Task | null> {
    const existing = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException();

    if (params?.sessionUserId) {
      await this.membershipService.assertProjectMember({
        userId: params.sessionUserId,
        projectId: existing.projectId,
      });
    }

    const nextStateId =
      data.stateId !== undefined ? data.stateId : existing.stateId;

    if (nextStateId && nextStateId !== existing.stateId) {
      await this.assertStateInProject(nextStateId, existing.projectId);
    }

    const shouldResolveRank =
      nextStateId !== null &&
      (data.order !== undefined ||
        (data.stateId !== undefined && data.stateId !== existing.stateId));

    let rank: string | undefined;

    if (shouldResolveRank) {
      if (data.order) {
        rank = await this.resolveRankFromOrder(nextStateId, data.order, id);
      } else {
        rank = await this.resolveRankAtEnd(nextStateId, id);
      }
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        dueDate: data.dueDate,
        ownerId: data.ownerId,
        ...(data.archived !== undefined && { archivedAt: data.archived ? new Date() : null }),
        ...(data.stateId !== undefined && { stateId: data.stateId }),
        ...(rank !== undefined && { rank }),
      },
    });

    return updated
      ? this.toTask(
          updated,
          await this.resolvePosition(updated.stateId, updated.rank),
        )
      : null;
  }

  async list(params: ListTasksParams): Promise<Paginated<Task>> {
    if (params.userId) {
      await this.membershipService.assertProjectMember({
        userId: params.userId,
        projectId: params.projectId,
      });
    }

    const where: Prisma.TaskWhereInput = {
      projectId: params.projectId,
      ...(params.stateId && { stateId: params.stateId }),
    };

    const [tasks, count] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip: params.page * params.take,
        take: params.take,
        orderBy: { rank: 'asc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    if (!params.stateId) {
      const results = await Promise.all(
        tasks.map(async (task) =>
          this.toTask(
            task,
            await this.resolvePosition(task.stateId, task.rank),
          ),
        ),
      );

      return { results, count };
    }

    const offset = params.page * params.take;

    return {
      results: tasks.map((task, index) =>
        this.toTask(task, offset + index),
      ),
      count,
    };
  }

  async getBoard(params: GetBoardParams): Promise<Board> {
    if (params.sessionUserId) {
      await this.membershipService.assertProjectMember({
        userId: params.sessionUserId,
        projectId: params.projectId,
      });
    }

    const states = await this.prisma.taskState.findMany({
      where: { projectId: params.projectId },
      orderBy: { rank: 'asc' },
      include: {
        tasks: {
          orderBy: { rank: 'asc' },
          where: { archivedAt: null },
        },
      },
    });

    return {
      projectId: params.projectId,
      states: states.map((state, stateIndex) => ({
        id: state.id,
        name: state.name,
        color: state.color,
        projectId: state.projectId,
        position: stateIndex,
        tasks: state.tasks.map((task, taskIndex) =>
          this.toTask(task, taskIndex),
        ),
      })),
    };
  }

  async delete(id: string, params?: DeleteTaskParams): Promise<void> {
    const existing = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException();

    if (params?.sessionUserId) {
      await this.membershipService.assertProjectMember({
        userId: params.sessionUserId,
        projectId: existing.projectId,
      });
    }

    await this.prisma.task.delete({ where: { id } });
  }

  private async assertStateInProject(
    stateId: string,
    projectId: string,
  ): Promise<void> {
    const state = await this.prisma.taskState.findFirst({
      where: { id: stateId, projectId },
      select: { id: true },
    });

    if (!state) {
      throw new BadRequestException('stateId not found in project');
    }
  }

  /**
   * Resolves a rank from neighbors within a column (state).
   * - no beforeId → first
   * - no afterId → last
   */
  private async resolveRankFromOrder(
    stateId: string,
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
        ? this.prisma.task.findFirst({
            where: { id: order.beforeId, stateId },
            select: { rank: true },
          })
        : null,
      order.afterId
        ? this.prisma.task.findFirst({
            where: { id: order.afterId, stateId },
            select: { rank: true },
          })
        : null,
    ]);

    if (order.beforeId && !before) {
      throw new BadRequestException('beforeId not found in state');
    }

    if (order.afterId && !after) {
      throw new BadRequestException('afterId not found in state');
    }

    return generateKeyBetween(before?.rank ?? null, after?.rank ?? null);
  }

  private async resolveRankAtEnd(
    stateId: string,
    excludeId?: string,
  ): Promise<string> {
    const last = await this.prisma.task.findFirst({
      where: {
        stateId,
        ...(excludeId && { id: { not: excludeId } }),
      },
      orderBy: { rank: 'desc' },
      select: { rank: true },
    });

    return generateKeyBetween(last?.rank ?? null, null);
  }

  private async resolvePosition(
    stateId: string | null,
    rank: string,
  ): Promise<number> {
    if (!stateId) return 0;

    return this.prisma.task.count({
      where: {
        stateId,
        rank: { lt: rank },
      },
    });
  }

  private toTask(data: PrismaTask, position: number): Task {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      dueDate: data.dueDate,
      position,
      projectId: data.projectId,
      ownerId: data.ownerId,
      stateId: data.stateId,
    };
  }
}
