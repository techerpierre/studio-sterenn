import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DeletePinCodeProcessData } from './pincode-2fa.types';
import { PrismaService } from '../prisma/prisma.service';

@Processor('pinCode2FA')
export class PinCode2FAProcessor extends WorkerHost {
  static readonly QUEUE_NAME = 'pinCode2FA';
  static readonly ACTION_DELETE_PIN_CODE = 'delete_pin_code';

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job, _token?: string): Promise<any> {
    switch (job.name) {
      case PinCode2FAProcessor.ACTION_DELETE_PIN_CODE:
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
