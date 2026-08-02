import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  JwtPayload,
  LoginData,
  RefreshTokenData,
  RegisterData,
  SendPinCodeData,
  Session,
  SessionWithoutRefresh,
  Validate2FAData,
} from './auth.types';
import { PinCode2FAService } from '../pincode-2fa/pincode-2fa.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import env from '@/config/env';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly pinCode2FAService: PinCode2FAService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async signIn(data: LoginData): Promise<void> {
    const user = await this.userService.validate(data.email, data.password);
    if (!user) throw new UnauthorizedException();
    await this.sendPinCode({ userId: user.id });
  }

  async register(data: RegisterData): Promise<void> {
    const user = await this.userService.create(data);
    await this.workspaceService.create({
      name: 'Perso',
      ownerId: user.id,
    });
    await this.sendPinCode({ userId: user.id });
  }

  async validate2FA(data: Validate2FAData): Promise<Session> {
    const pinCode = await this.pinCode2FAService.validateAndDelete(
      data.pinCode,
    );

    const payload: JwtPayload = {
      userId: pinCode.userId,
    };

    const token = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: '1y',
    });

    return {
      token,
      refreshToken,
    };
  }

  async refreshToken(data: RefreshTokenData): Promise<SessionWithoutRefresh> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        data.refreshToken,
        {
          secret: env.REFRESH_TOKEN_SECRET_KEY,
        },
      );
      const token = await this.jwtService.signAsync({
        userId: payload.userId,
      });
      return { token };
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async sendPinCode(data: SendPinCodeData): Promise<void> {
    const pinCode = await this.pinCode2FAService.generate({
      userId: data.userId,
    });
    await this.emailService.send({ content: pinCode });
  }
}
