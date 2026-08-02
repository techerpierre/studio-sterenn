import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PinCode2FAService } from './pincode-2fa.service';
import { BullModule } from '@nestjs/bullmq';
import { PinCode2FAQueueName } from './pincode-2fa.constants';
import { PinCode2FAProcessor } from './pincode-2fa.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: PinCode2FAQueueName,
    }),
  ],
  providers: [PinCode2FAService, PinCode2FAProcessor],
  exports: [PinCode2FAService],
})
export class PinCode2FAModule {}
