import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DeletePinCodeProcessData } from './pincode-2fa.types';
import { PrismaService } from '../prisma/prisma.service';
import { PinCode2FAAction, PinCode2FAQueueName } from './pincode-2fa.constants';

@Processor(PinCode2FAQueueName)
export class PinCode2FAProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job, _token?: string): Promise<any> {
    switch (job.name) {
      case PinCode2FAAction.DeletePinCode:
        return this.deletePinCode(job.data);
    }
  }

  private async deletePinCode(data: DeletePinCodeProcessData): Promise<{}> {
    this.prisma.pinCode2FA.delete({
      where: { code: data.code },
    });
    return {};
  }
}
