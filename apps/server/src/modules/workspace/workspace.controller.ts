import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';

import { SessionUser } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/auth.guard';
import type { User } from '../user/user.types';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { ListWorkspacesDto } from './dto/list-workspaces.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceService } from './workspace.service';

@UseGuards(AuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(
    @SessionUser() sessionUser: User,
    @Body() body: CreateWorkspaceDto,
  ): Promise<Contracts.Workspace> {
    return this.workspaceService.create({
      ownerId: sessionUser.id,
      name: body.name,
    });
  }

  @Patch(':id')
  async update(
    @SessionUser() sessionUser: User,
    @Param('id') id: string,
    @Body() body: UpdateWorkspaceDto,
  ): Promise<Contracts.Workspace | null> {
    return this.workspaceService.update(
      id,
      { name: body.name },
      { sessionUserId: sessionUser.id },
    );
  }

  @Get()
  async list(
    @Query() query: ListWorkspacesDto,
    @SessionUser() sessionUser: User,
  ): Promise<Contracts.Paginated<Contracts.Workspace>> {
    return this.workspaceService.list({
      page: query.page,
      take: query.take,
      userId: sessionUser.id,
    });
  }
}
