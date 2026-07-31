"use server";

import core from "@/config/core";
import {
  getCurrentWorkspace as getPersistedWorkspace,
  getSession,
  persistCurrentWorkspace,
} from "@/lib/session-persistence";
import {
  createWorkspaceSchema,
  CreateWorkspaceSchema,
} from "@/validation/workspace.schemas";
import {
  ListWorkspacesParams,
  MembershipRole,
  Paginated,
  Workspace,
  WorkspaceWithMembership,
} from "@sterenn/api-contracts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { WorkspaceSelectorData } from "@/types/workspace.types";

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
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return core.workspace.list({
    page: params?.page ?? 0,
    take: params?.take ?? 10,
  });
}

export async function setCurrentWorkspace(workspace: WorkspaceWithMembership): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  await persistCurrentWorkspace(workspace);
  revalidatePath("/dashboard");
  revalidatePath("/workspaces");
  redirect("/dashboard");
}

export async function ensureCurrentWorkspace(
  workspace: WorkspaceWithMembership,
): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const existing = await getPersistedWorkspace();
  if (existing) {
    return;
  }
  await persistCurrentWorkspace(workspace);
}

export async function getCurrentWorkspace(): Promise<WorkspaceWithMembership | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return getPersistedWorkspace();
}

export async function getWorkspaceSelectorData(
  params?: ListWorkspacesParams,
): Promise<WorkspaceSelectorData> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const take = params?.take ?? 10;
  const page = params?.page ?? 0;
  const paginated = await core.workspace.list({ page, take });

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
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const validatedData = createWorkspaceSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }
  const workspace = await core.workspace.create(validatedData.data);
  const workspaceWithMembership: WorkspaceWithMembership = {
    ...workspace,
    role: MembershipRole.ADMIN,
  };
  await persistCurrentWorkspace(workspaceWithMembership);
  revalidatePath("/dashboard");
  revalidatePath("/workspaces");
  return workspaceWithMembership;
}
