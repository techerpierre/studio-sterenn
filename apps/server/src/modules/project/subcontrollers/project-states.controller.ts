import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';

import { SessionUser } from '../../auth/auth.decorators';
import { AuthGuard } from '../../auth/auth.guard';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { TaskStateService } from '../../task-state/task-state.service';
import type { User } from '../../user/user.types';
import { CreateTaskStateDto } from '../dto/create-task-state.dto';
import { UpdateTaskStatesOrderDto } from '../dto/update-task-states-order.dto';

@UseGuards(AuthGuard)
@Controller('projects/:projectId/states')
export class ProjectStatesController {
  constructor(private readonly taskStateService: TaskStateService) {}

  @Get()
  async list(
    @SessionUser() sessionUser: User,
    @Param('projectId') projectId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<Contracts.Paginated<Contracts.TaskState>> {
    return this.taskStateService.list({
      ...query,
      projectId,
      userId: sessionUser.id,
    });
  }

  @Post()
  async create(
    @SessionUser() sessionUser: User,
    @Param('projectId') projectId: string,
    @Body() body: CreateTaskStateDto,
  ): Promise<Contracts.TaskState> {
    return this.taskStateService.create(
      {
        ...body,
        projectId,
      },
      { sessionUserId: sessionUser.id },
    );
  }

  @Put('order')
  async updateOrder(
    @SessionUser() sessionUser: User,
    @Param('projectId') projectId: string,
    @Body() body: UpdateTaskStatesOrderDto,
  ): Promise<Contracts.TaskState[]> {
    return this.taskStateService.updateOrder(
      projectId,
      { stateIds: body.stateIds },
      { sessionUserId: sessionUser.id },
    );
  }
}
