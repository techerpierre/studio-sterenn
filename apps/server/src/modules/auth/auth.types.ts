import { CreateUserData } from '../user/user.types';

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = CreateUserData;

export type Validate2FAData = {
  pinCode: string;
};

export type RefreshTokenData = {
  refreshToken: string;
};

export type SendPinCodeData = {
  userId: string;
};

export type Session = {
  token: string;
  refreshToken: string;
};

export type SessionWithoutRefresh = Omit<Session, 'refreshToken'>;

export type JwtPayload = {
  userId: string;
};
