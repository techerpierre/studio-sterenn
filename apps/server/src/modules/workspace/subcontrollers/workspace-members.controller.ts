import {
  Body,
  Controller,
  Delete,
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
import { MembershipService } from '../../membership/membership.service';
import type { User } from '../../user/user.types';
import { AddMemberDto } from '../dto/add-member.dto';
import { WorkspaceService } from '../workspace.service';

@UseGuards(AuthGuard)
@Controller('workspaces/:workspaceId/members')
export class WorkspaceMembersController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Get()
  async list(
    @SessionUser() sessionUser: User,
    @Param('workspaceId') workspaceId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<Contracts.Paginated<Contracts.Member>> {
    return this.membershipService.list({
      page: query.page,
      take: query.take,
      workspaceId,
      userId: sessionUser.id,
    });
  }

  @Post()
  async add(
    @SessionUser() sessionUser: User,
    @Param('workspaceId') workspaceId: string,
    @Body() body: AddMemberDto,
  ): Promise<void> {
    return this.workspaceService.addMember(
      workspaceId,
      { memberId: body.memberId, role: body.role },
      { sessionUserId: sessionUser.id },
    );
  }

  @Delete(':memberId')
  async revoke(
    @SessionUser() sessionUser: User,
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
  ): Promise<void> {
    return this.workspaceService.revokeMember(
      workspaceId,
      { memberId },
      { sessionUserId: sessionUser.id },
    );
  }
}
