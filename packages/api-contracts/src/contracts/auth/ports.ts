import { RefreshTokenData, RegisterData, SignInData, Validate2FAData } from "./inputs.js";
import { Profile, Session, SessionWithoutRefresh } from "./outputs.js";

export interface IAuthAdapter {
    signIn(data: SignInData): Promise<void>;
    register(data: RegisterData): Promise<void>;
    validate2FA(data: Validate2FAData): Promise<Session>;
    refreshToken(data: RefreshTokenData): Promise<SessionWithoutRefresh>;
    getProfile(): Promise<Profile>;
}