import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';

import { SessionUser } from '../../auth/auth.decorators';
import { AuthGuard } from '../../auth/auth.guard';
import { toTaskContract } from '../../task/task.mapper';
import { TaskService } from '../../task/task.service';
import type { User } from '../../user/user.types';
import { CreateTaskDto } from '../dto/create-task.dto';
import { ListTasksQueryDto } from '../dto/list-tasks-query.dto';

@UseGuards(AuthGuard)
@Controller('projects/:projectId/tasks')
export class ProjectTasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async list(
    @SessionUser() sessionUser: User,
    @Param('projectId') projectId: string,
    @Query() query: ListTasksQueryDto,
  ): Promise<Contracts.Paginated<Contracts.Task>> {
    const result = await this.taskService.list({
      ...query,
      projectId,
      userId: sessionUser.id,
    });

    return {
      results: result.results.map((task) => toTaskContract(task)),
      count: result.count,
    };
  }

  @Post()
  async create(
    @SessionUser() sessionUser: User,
    @Param('projectId') projectId: string,
    @Body() body: CreateTaskDto,
  ): Promise<Contracts.Task> {
    const task = await this.taskService.create(
      {
        ...body,
        projectId,
        ownerId: body.ownerId ?? sessionUser.id,
      },
      { sessionUserId: sessionUser.id },
    );

    return toTaskContract(task);
  }
}
