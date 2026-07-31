import { Module } from '@nestjs/common';

import { MembershipModule } from '../membership/membership.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { WorkspaceMembersController } from './subcontrollers/workspace-members.controller';
import { WorkspaceProjectsController } from './subcontrollers/workspace-projects.controller';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [PrismaModule, MembershipModule, UserModule, ProjectModule],
  controllers: [
    WorkspaceController,
    WorkspaceMembersController,
    WorkspaceProjectsController,
  ],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
