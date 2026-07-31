import { Module } from '@nestjs/common';

import { MembershipModule } from '../membership/membership.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { TaskStateController } from './task-state.controller';
import { TaskStateService } from './task-state.service';

@Module({
  imports: [PrismaModule, MembershipModule, UserModule],
  controllers: [TaskStateController],
  providers: [TaskStateService],
  exports: [TaskStateService],
})
export class TaskStateModule {}
