import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import env from './config/env';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { ProjectModule } from './modules/project/project.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    ProjectModule,
    TagModule,
    BullModule.forRoot({
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
