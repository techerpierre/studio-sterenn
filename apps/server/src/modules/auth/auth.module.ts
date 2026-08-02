import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PinCode2FAModule } from '../pincode-2fa/pincode-2fa.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import env from '@/config/env';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [
    UserModule,
    PinCode2FAModule,
    EmailModule,
    WorkspaceModule,
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
