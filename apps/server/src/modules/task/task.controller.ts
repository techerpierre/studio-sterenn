import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';

import { SessionUser } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/auth.guard';
import type { User } from '../user/user.types';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import type { Task } from './task.types';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':taskId')
  async get(
    @SessionUser() sessionUser: User,
    @Param('taskId') taskId: string,
  ): Promise<Contracts.Task | null> {
    const task = await this.taskService.get(taskId, {
      sessionUserId: sessionUser.id,
    });

    return task ? this.toContract(task) : null;
  }

  @Patch(':taskId')
  async update(
    @SessionUser() sessionUser: User,
    @Param('taskId') taskId: string,
    @Body() body: UpdateTaskDto,
  ): Promise<Contracts.Task | null> {
    const task = await this.taskService.update(
      taskId,
      body,
      { sessionUserId: sessionUser.id },
    );

    return task ? this.toContract(task) : null;
  }

  @Delete(':taskId')
  async delete(
    @SessionUser() sessionUser: User,
    @Param('taskId') taskId: string,
  ): Promise<void> {
    return this.taskService.delete(taskId, {
      sessionUserId: sessionUser.id,
    });
  }

  private toContract(task: Task): Contracts.Task {
    return {
      id: task.id,
      title: task.title,
      content: task.content,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      position: task.position,
      projectId: task.projectId,
      ownerId: task.ownerId,
      stateId: task.stateId,
    };
  }
}
