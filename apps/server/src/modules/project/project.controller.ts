import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Contracts from '@sterenn/api-contracts';

import { SessionUser } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/auth.guard';
import type { User } from '../user/user.types';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectsDto } from './dto/list-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(
    @SessionUser() sessionUser: User,
    @Body() body: CreateProjectDto,
  ): Promise<Contracts.Project> {
    return this.projectService.create(
      {
        name: body.name,
        slug: body.slug,
        workspaceId: body.workspaceId,
      },
      { sessionUserId: sessionUser.id },
    );
  }

  @Get()
  async list(
    @Query() query: ListProjectsDto,
    @SessionUser() sessionUser: User,
  ): Promise<Contracts.Paginated<Contracts.Project>> {
    return this.projectService.list({
      page: query.page,
      take: query.take,
      workspaceId: query.workspaceId,
      userId: sessionUser.id,
    });
  }

  @Get(':id')
  async get(
    @SessionUser() sessionUser: User,
    @Param('id') id: string,
  ): Promise<Contracts.Project | null> {
    return this.projectService.get(id, {
      sessionUserId: sessionUser.id,
    });
  }

  @Patch(':id')
  async update(
    @SessionUser() sessionUser: User,
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
  ): Promise<Contracts.Project | null> {
    return this.projectService.update(
      id,
      { name: body.name, slug: body.slug },
      { sessionUserId: sessionUser.id },
    );
  }

  @Delete(':id')
  async delete(
    @SessionUser() sessionUser: User,
    @Param('id') id: string,
  ): Promise<void> {
    return this.projectService.delete(id, {
      sessionUserId: sessionUser.id,
    });
  }
}
