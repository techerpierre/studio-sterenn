import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';

import { SessionUser } from '../../auth/auth.decorators';
import { AuthGuard } from '../../auth/auth.guard';
import { TaskService } from '../../task/task.service';
import type { Board, Task } from '../../task/task.types';
import type { User } from '../../user/user.types';

@UseGuards(AuthGuard)
@Controller('projects/:projectId/board')
export class ProjectBoardController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async get(
    @SessionUser() sessionUser: User,
    @Param('projectId') projectId: string,
  ): Promise<Contracts.Board> {
    const board = await this.taskService.getBoard({
      projectId,
      sessionUserId: sessionUser.id,
    });

    return this.toContract(board);
  }

  private toContract(board: Board): Contracts.Board {
    return {
      projectId: board.projectId,
      states: board.states.map((state) => ({
        id: state.id,
        name: state.name,
        position: state.position,
        color: state.color,
        projectId: state.projectId,
        tasks: state.tasks.map((task) => this.toTaskContract(task)),
      })),
    };
  }

  private toTaskContract(task: Task): Contracts.Task {
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
