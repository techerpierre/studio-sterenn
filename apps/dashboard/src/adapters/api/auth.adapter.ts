import axios from 'axios';
import httpClient from '@/config/httpClient';
import env from '@/config/env';
import {
  IAuthAdapter,
  Validate2FAData,
  Profile,
  RefreshTokenData,
  SessionWithoutRefresh,
  Session,
  RegisterData,
  SignInData,
} from '@sterenn/api-contracts';

export class AuthAdapter implements IAuthAdapter {
  async signIn(data: SignInData): Promise<void> {
    await httpClient.post('/auth/sign-in', data);
  }

  async register(data: RegisterData): Promise<void> {
    await httpClient.post('/auth/register', data);
  }

  async validate2FA(data: Validate2FAData): Promise<Session> {
    return httpClient.post('/auth/validate-2fa', data);
  }

  async refreshToken(data: RefreshTokenData): Promise<SessionWithoutRefresh> {
    // Raw axios: no auth header / no next/headers — usable from proxy
    const { data: session } = await axios.post<SessionWithoutRefresh>(
      `${env.API_BASE_URL}/auth/refresh-token`,
      data
    );
    return session;
  }

  async getProfile(): Promise<Profile> {
    return httpClient.get('/auth/profile');
  }
}
