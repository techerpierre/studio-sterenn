import { clearSession, persistSession } from '@/lib/session-persistence';
import {
  IAuthAdapter,
  Profile,
  RefreshTokenData,
  RegisterData,
  Session,
  SessionWithoutRefresh,
  SignInData,
  Validate2FAData,
} from '@sterenn/api-contracts';

export class AuthService {
  constructor(private readonly authAdapter: IAuthAdapter) {}

  async signIn(data: SignInData): Promise<void> {
    await this.authAdapter.signIn(data);
  }

  async register(data: RegisterData): Promise<void> {
    await this.authAdapter.register(data);
  }

  async validate2FA(data: Validate2FAData): Promise<Session> {
    const session = await this.authAdapter.validate2FA(data);
    await persistSession(session);
    return session;
  }

  async refreshToken(data: RefreshTokenData): Promise<SessionWithoutRefresh> {
    return this.authAdapter.refreshToken(data);
  }

  async getProfile(): Promise<Profile> {
    return await this.authAdapter.getProfile();
  }

  async signOut(): Promise<void> {
    await clearSession();
  }
}
