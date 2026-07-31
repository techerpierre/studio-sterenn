import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';

import { SessionUser } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/auth.guard';
import type { User } from '../user/user.types';
import { UpdateTaskStateDto } from './dto/update-task-state.dto';
import { TaskStateService } from './task-state.service';

@UseGuards(AuthGuard)
@Controller('task-states')
export class TaskStateController {
  constructor(private readonly taskStateService: TaskStateService) {}

  @Patch(':stateId')
  async update(
    @SessionUser() sessionUser: User,
    @Param('stateId') stateId: string,
    @Body() body: UpdateTaskStateDto,
  ): Promise<Contracts.TaskState | null> {
    return this.taskStateService.update(
      stateId,
      {
        ...body,
        order: body.order,
      },
      { sessionUserId: sessionUser.id },
    );
  }

  @Delete(':stateId')
  async delete(
    @SessionUser() sessionUser: User,
    @Param('stateId') stateId: string,
  ): Promise<void> {
    return this.taskStateService.delete(stateId, {
      sessionUserId: sessionUser.id,
    });
  }
}
