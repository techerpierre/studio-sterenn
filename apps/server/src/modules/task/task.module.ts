import { Module } from '@nestjs/common';

import { MembershipModule } from '../membership/membership.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { TaskTagsController } from './subcontrollers/task-tags.controller';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { StorageModule } from '../storage/storage.module';
import { BullModule } from '@nestjs/bullmq';
import { TaskProcessor } from './task.processor';
import { TaskExportService } from './subservices/task-export.service';
import { TaskQueueName } from './task.constants';

@Module({
  imports: [
    PrismaModule,
    MembershipModule,
    UserModule,
    StorageModule,
    BullModule.registerQueue({ name: TaskQueueName }),
  ],
  controllers: [TaskController, TaskTagsController],
  providers: [TaskService, TaskExportService, TaskProcessor],
  exports: [TaskService, TaskExportService],
})
export class TaskModule {}
