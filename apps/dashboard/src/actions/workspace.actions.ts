'use server';

import { requireSession } from '@/actions/auth.actions';
import httpClient from '@/config/httpClient';
import {
  getCurrentWorkspace as getPersistedWorkspace,
  persistCurrentWorkspace,
} from '@/lib/session-persistence';
import { WorkspaceSelectorData } from '@/types/workspace.types';
import {
  createWorkspaceSchema,
  CreateWorkspaceSchema,
} from '@/validation/workspace.schemas';
import {
  ListWorkspacesParams,
  MembershipRole,
  Paginated,
  Workspace,
  WorkspaceWithMembership,
} from '@sterenn/api-contracts';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function withCurrentWorkspace(
  results: WorkspaceWithMembership[],
  current: WorkspaceWithMembership | null,
): WorkspaceWithMembership[] {
  if (!current) {
    return results;
  }

  if (results.some((workspace) => workspace.id === current.id)) {
    return results;
  }

  return [current, ...results];
}

export async function listWorkspaces(
  params?: ListWorkspacesParams,
): Promise<Paginated<WorkspaceWithMembership>> {
  await requireSession();

  return httpClient.get('/workspaces', {
    params: {
      page: params?.page ?? 0,
      take: params?.take ?? 10,
    },
  });
}

export async function setCurrentWorkspace(
  workspace: WorkspaceWithMembership,
): Promise<void> {
  await requireSession();
  await persistCurrentWorkspace(workspace);
  revalidatePath('/dashboard');
  revalidatePath('/workspaces');
  redirect('/dashboard');
}

export async function ensureCurrentWorkspace(
  workspace: WorkspaceWithMembership,
): Promise<void> {
  await requireSession();
  const existing = await getPersistedWorkspace();
  if (existing) {
    return;
  }
  await persistCurrentWorkspace(workspace);
}

export async function getCurrentWorkspace(): Promise<WorkspaceWithMembership | null> {
  try {
    await requireSession();
  } catch {
    return null;
  }
  return getPersistedWorkspace();
}

export async function getWorkspaceSelectorData(
  params?: ListWorkspacesParams,
): Promise<WorkspaceSelectorData> {
  await requireSession();

  const take = params?.take ?? 10;
  const page = params?.page ?? 0;
  const paginated = await httpClient.get<Paginated<WorkspaceWithMembership>>(
    '/workspaces',
    { params: { page, take } },
  );

  const persistedWorkspace = await getPersistedWorkspace();
  const shouldPersistCurrent =
    !persistedWorkspace && Boolean(paginated.results[0]);
  const currentWorkspace = persistedWorkspace ?? paginated.results[0] ?? null;

  return {
    workspaces: withCurrentWorkspace(paginated.results, currentWorkspace),
    count: paginated.count,
    currentWorkspace,
    shouldPersistCurrent,
  };
}

export async function createWorkspace(
  data: CreateWorkspaceSchema,
): Promise<WorkspaceWithMembership> {
  await requireSession();

  const validatedData = createWorkspaceSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }

  const workspace = await httpClient.post<Workspace>(
    '/workspaces',
    validatedData.data,
  );
  const workspaceWithMembership: WorkspaceWithMembership = {
    ...workspace,
    role: MembershipRole.ADMIN,
  };
  await persistCurrentWorkspace(workspaceWithMembership);
  revalidatePath('/dashboard');
  revalidatePath('/workspaces');
  return workspaceWithMembership;
}
