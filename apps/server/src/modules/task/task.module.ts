import { Module } from '@nestjs/common';

import { MembershipModule } from '../membership/membership.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [PrismaModule, MembershipModule, UserModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
