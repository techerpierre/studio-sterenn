import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PinCode2FAService } from './pincode-2fa.service';
import { BullModule } from '@nestjs/bullmq';
import { PinCode2FAProcessor } from './pincode-2fa.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: PinCode2FAProcessor.QUEUE_NAME,
    }),
  ],
  providers: [PinCode2FAService],
  exports: [PinCode2FAService],
})
export class PinCode2FAModule {}
