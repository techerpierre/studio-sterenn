import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';

import { SessionUser } from '../../auth/auth.decorators';
import { AuthGuard } from '../../auth/auth.guard';
import type { User } from '../../user/user.types';
import { AttachTaskTagDto } from '../dto/attach-task-tag.dto';
import { toTaskContract } from '../task.mapper';
import { TaskService } from '../task.service';

@UseGuards(AuthGuard)
@Controller('tasks/:taskId/tags')
export class TaskTagsController {
  constructor(private readonly taskService: TaskService) {}

  @Patch()
  async attach(
    @SessionUser() sessionUser: User,
    @Param('taskId') taskId: string,
    @Body() body: AttachTaskTagDto,
  ): Promise<Contracts.Task> {
    const task = await this.taskService.attachTag(
      taskId,
      body.tagId,
      { sessionUserId: sessionUser.id },
    );
    return toTaskContract(task);
  }

  @Delete(':tagId')
  async detach(
    @SessionUser() sessionUser: User,
    @Param('taskId') taskId: string,
    @Param('tagId') tagId: string,
  ): Promise<Contracts.Task> {
    const task = await this.taskService.detachTag(
      taskId,
      tagId,
      { sessionUserId: sessionUser.id },
    );
    return toTaskContract(task);
  }
}
