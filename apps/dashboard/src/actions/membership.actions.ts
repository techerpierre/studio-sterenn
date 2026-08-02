'use server';

import { requireSession } from '@/actions/auth.actions';
import httpClient from '@/config/httpClient';
import {
  ListMembersParams,
  Member,
  Paginated,
} from '@sterenn/api-contracts';

export async function listMembers(
  params: ListMembersParams,
): Promise<Paginated<Member>> {
  await requireSession();

  if (!params.workspaceId) {
    throw new Error('workspaceId is required');
  }

  const { workspaceId, ...pagination } = params;

  return httpClient.get(`/workspaces/${workspaceId}/members`, {
    params: {
      page: pagination.page ?? 0,
      take: pagination.take ?? 20,
    },
  });
}
