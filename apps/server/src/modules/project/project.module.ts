import { Module } from '@nestjs/common';

import { MembershipModule } from '../membership/membership.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskModule } from '../task/task.module';
import { TaskStateModule } from '../task-state/task-state.module';
import { UserModule } from '../user/user.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectBoardController } from './subcontrollers/project-board.controller';
import { ProjectStatesController } from './subcontrollers/project-states.controller';
import { ProjectTasksController } from './subcontrollers/project-tasks.controller';

@Module({
  imports: [
    PrismaModule,
    MembershipModule,
    UserModule,
    TaskStateModule,
    TaskModule,
  ],
  controllers: [
    ProjectController,
    ProjectStatesController,
    ProjectTasksController,
    ProjectBoardController,
  ],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
