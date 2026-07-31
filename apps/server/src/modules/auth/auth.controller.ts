import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionUser } from './auth.decorators';
import type { User } from '../user/user.types';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';
import { Validate2FADto } from './dto/validate-2fa.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './auth.guard';
import * as Contracts from '@sterenn/api-contracts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() body: SignInDto): Promise<void> {
    return this.authService.signIn({
      email: body.email,
      password: body.password,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<void> {
    return this.authService.register({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
    });
  }

  @Post('validate-2fa')
  async validate2FA(@Body() body: Validate2FADto): Promise<Contracts.Session> {
    return this.authService.validate2FA({
      pinCode: body.pinCode,
    });
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<Contracts.SessionWithoutRefresh> {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
    });
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@SessionUser() sessionUser: User): Promise<Contracts.Profile> {
    return sessionUser;
  }
}
