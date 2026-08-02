'use server';

import { requireSession } from '@/actions/auth.actions';
import httpClient from '@/config/httpClient';
import { User } from '@sterenn/api-contracts';

export async function getUser(id: string): Promise<User | null> {
  await requireSession();
  return httpClient.get(`/users/${id}`);
}
