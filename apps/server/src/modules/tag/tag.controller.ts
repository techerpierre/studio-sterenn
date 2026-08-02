import {
  Body,
  Controller,
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
import { CreateTagDto, ListTagsQueryDto, UpdateTagDto } from './dto/tag.dto';
import { TagService } from './tag.service';
import type { Tag } from './tag.types';

@UseGuards(AuthGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(
    @SessionUser() sessionUser: User,
    @Body() body: CreateTagDto,
  ): Promise<Contracts.Tag> {
    const tag = await this.tagService.create(body, {
      sessionUserId: sessionUser.id,
    });
    return this.toContract(tag);
  }

  @Get()
  async list(
    @SessionUser() sessionUser: User,
    @Query() query: ListTagsQueryDto,
  ): Promise<Contracts.Paginated<Contracts.Tag>> {
    const result = await this.tagService.list({
      ...query,
      userId: sessionUser.id,
    });

    return {
      results: result.results.map((tag) => this.toContract(tag)),
      count: result.count,
    };
  }

  @Patch(':tagId')
  async update(
    @SessionUser() sessionUser: User,
    @Param('tagId') tagId: string,
    @Body() body: UpdateTagDto,
  ): Promise<Contracts.Tag | null> {
    const tag = await this.tagService.update(tagId, body, {
      sessionUserId: sessionUser.id,
    });
    return tag ? this.toContract(tag) : null;
  }

  private toContract(tag: Tag): Contracts.Tag {
    return {
      id: tag.id,
      name: tag.name,
      color: tag.color,
      projectId: tag.projectId,
    };
  }
}
