import {
  Controller,
  Get,
  MessageEvent,
  Param,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';
import { map, Observable } from 'rxjs';

import { SessionUser } from '../../auth/auth.decorators';
import { AuthGuard } from '../../auth/auth.guard';
import {
  toTaskContract,
  toTaskExportEventContract,
} from '../../task/task.mapper';
import { TaskService } from '../../task/task.service';
import type { Board } from '../../task/task.types';
import type { User } from '../../user/user.types';
import { GetBoardQueryDto } from '../dto/get-board-query.dto';
import { TaskExportService } from '@/modules/task/subservices/task-export.service';
import { ExportBoardQueryDto } from '../dto/export-board-query.dto';

@UseGuards(AuthGuard)
@Controller('projects/:projectId/board')
export class ProjectBoardController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskExportService: TaskExportService,
  ) {}

  @Get()
  async get(
    @SessionUser() sessionUser: User,
    @Param('projectId') projectId: string,
    @Query() query: GetBoardQueryDto,
  ): Promise<Contracts.Board> {
    const board = await this.taskService.getBoard({
      projectId,
      sessionUserId: sessionUser.id,
      ...(query.ownerId ? { ownerId: query.ownerId } : {}),
      ...(query.tags?.length ? { tags: query.tags } : {}),
    });

    return this.toContract(board);
  }

  @Sse('export')
  exportBoard(
    @SessionUser() sessionUser: User,
    @Param('projectId') projectId: string,
    @Query() query: ExportBoardQueryDto,
  ): Observable<MessageEvent> {
    return this.taskExportService
      .exportBoardSse({
        userId: sessionUser.id,
        projectId,
        type: query.type,
      })
      .pipe(
        map((event) => ({
          data: toTaskExportEventContract(event),
        })),
      );
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
        tasks: state.tasks.map((task) => toTaskContract(task)),
      })),
    };
  }
}
