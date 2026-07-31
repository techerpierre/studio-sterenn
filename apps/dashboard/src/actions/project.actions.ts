"use server";

import core from "@/config/core";
import { getSession } from "@/lib/session-persistence";
import {
  createProjectSchema,
  CreateProjectSchema,
  updateProjectSchema,
  UpdateProjectSchema,
} from "@/validation/project.schemas";
import {
  ListProjectsParams,
  Paginated,
  Project,
} from "@sterenn/api-contracts";
import { revalidatePath } from "next/cache";

export async function listProjects(
  params: ListProjectsParams,
): Promise<Paginated<Project>> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!params.workspaceId) {
    throw new Error("workspaceId is required");
  }

  return core.project.list({
    workspaceId: params.workspaceId,
    page: params.page ?? 0,
    take: params.take ?? 10,
  });
}

export async function getProject(id: string): Promise<Project | null> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return core.project.get(id);
}

export async function createProject(
  data: CreateProjectSchema,
): Promise<Project> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const validatedData = createProjectSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }
  const project = await core.project.create(validatedData.data);
  revalidatePath("/dashboard");
  return project;
}

export async function updateProject(
  id: string,
  data: UpdateProjectSchema,
): Promise<Project | null> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const validatedData = updateProjectSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }
  const project = await core.project.update(id, validatedData.data);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${id}`);
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  await core.project.delete(id);
  revalidatePath("/dashboard");
}
