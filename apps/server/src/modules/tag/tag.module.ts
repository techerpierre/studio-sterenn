import { Module } from '@nestjs/common';

import { MembershipModule } from '../membership/membership.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [PrismaModule, MembershipModule, UserModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
