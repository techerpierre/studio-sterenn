'use server';

import axios from 'axios';
import { redirect } from 'next/navigation';

import httpClient from '@/config/httpClient';
import env from '@/config/env';
import {
  clearSession,
  getSession,
  persistSession,
} from '@/lib/session-persistence';
import {
  SignInSchema,
  signInSchema,
  RegisterSchema,
  registerSchema,
  validate2faSchema,
  Validate2faSchema,
} from '@/validation/auth.schemas';
import {
  Profile,
  RefreshTokenData,
  Session,
  SessionWithoutRefresh,
} from '@sterenn/api-contracts';

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function signIn(data: SignInSchema): Promise<void> {
  const validatedData = signInSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }
  await httpClient.post('/auth/sign-in', validatedData.data);
}

export async function register(data: RegisterSchema): Promise<void> {
  const validatedData = registerSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }

  const { confirmPassword: _confirmPassword, ...registerData } =
    validatedData.data;
  await httpClient.post('/auth/register', registerData);
}

export async function validate2fa(data: Validate2faSchema): Promise<void> {
  const validatedData = validate2faSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }

  const session = await httpClient.post<Session>(
    '/auth/validate-2fa',
    validatedData.data,
  );
  await persistSession(session);
}

/**
 * Raw axios — no auth header / no next/headers cookies.
 * Usable from the middleware proxy.
 */
export async function refreshToken(
  data: RefreshTokenData,
): Promise<SessionWithoutRefresh> {
  const { data: session } = await axios.post<SessionWithoutRefresh>(
    `${env.API_BASE_URL}/auth/refresh-token`,
    data,
  );
  return session;
}

export async function getProfile(): Promise<Profile> {
  await requireSession();
  return httpClient.get('/auth/profile');
}

export async function signOut(): Promise<void> {
  await clearSession();
  redirect('/sign-in');
}
