import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import env from '@/config/env';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg(env.DATABASE_URL);
    super({ adapter });
  }
}
