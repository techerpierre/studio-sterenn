import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DeletePinCodeProcessData,
  GeneratePinCodeData,
  PinCode2FA,
} from './pincode-2fa.types';
import { PinCode2FA as PrismaPinCode2FA } from '@/generated/prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PinCode2FAAction, PinCode2FAQueueName } from './pincode-2fa.constants';

@Injectable()
export class PinCode2FAService {
  private readonly PinCodeDeletionTime = 120_000_000;

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(PinCode2FAQueueName)
    private readonly pinCode2FAQueue: Queue,
  ) {}

  async generate(data: GeneratePinCodeData): Promise<PinCode2FA> {
    const code = await this.generateUniqueCode();

    const newPinCode = await this.prisma.pinCode2FA.create({
      data: {
        code,
        userId: data.userId,
      },
    });

    await this.pinCode2FAQueue.add(
      PinCode2FAAction.DeletePinCode,
      { code } as DeletePinCodeProcessData,
      { delay: this.PinCodeDeletionTime },
    );

    return this.toPinCode2FA(newPinCode);
  }

  async validateAndDelete(code: string): Promise<PinCode2FA> {
    const pinCode = await this.prisma.pinCode2FA.delete({
      where: { code },
    });

    if (!pinCode) throw new UnauthorizedException();

    return this.toPinCode2FA(pinCode);
  }

  private async generateUniqueCode(): Promise<string> {
    let code: string = '';
    let isExists: boolean = false;

    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      isExists = !!(await this.prisma.pinCode2FA.findUnique({
        where: { code },
      }));
    } while (isExists);

    return code;
  }

  private toPinCode2FA(data: PrismaPinCode2FA): PinCode2FA {
    return {
      code: data.code,
      userId: data.userId,
    };
  }
}
