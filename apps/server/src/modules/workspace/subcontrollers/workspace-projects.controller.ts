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
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ProjectService } from '../../project/project.service';
import type { User } from '../../user/user.types';
import { CreateWorkspaceProjectDto } from '../dto/create-workspace-project.dto';

@UseGuards(AuthGuard)
@Controller('workspaces/:workspaceId/projects')
export class WorkspaceProjectsController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(
    @SessionUser() sessionUser: User,
    @Param('workspaceId') workspaceId: string,
    @Body() body: CreateWorkspaceProjectDto,
  ): Promise<Contracts.Project> {
    return this.projectService.create(
      {
        name: body.name,
        slug: body.slug,
        workspaceId,
      },
      { sessionUserId: sessionUser.id },
    );
  }

  @Get()
  async list(
    @SessionUser() sessionUser: User,
    @Param('workspaceId') workspaceId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<Contracts.Paginated<Contracts.Project>> {
    return this.projectService.list({
      page: query.page,
      take: query.take,
      workspaceId,
      userId: sessionUser.id,
    });
  }
}
