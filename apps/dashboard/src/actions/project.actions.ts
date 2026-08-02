'use server';

import { requireSession } from '@/actions/auth.actions';
import httpClient from '@/config/httpClient';
import {
  createProjectSchema,
  CreateProjectSchema,
  updateProjectSchema,
  UpdateProjectSchema,
} from '@/validation/project.schemas';
import {
  ListProjectsParams,
  Paginated,
  Project,
} from '@sterenn/api-contracts';
import { revalidatePath } from 'next/cache';

export async function listProjects(
  params: ListProjectsParams,
): Promise<Paginated<Project>> {
  await requireSession();

  if (!params.workspaceId) {
    throw new Error('workspaceId is required');
  }

  return httpClient.get('/projects', {
    params: {
      workspaceId: params.workspaceId,
      page: params.page ?? 0,
      take: params.take ?? 10,
    },
  });
}

export async function getProject(id: string): Promise<Project | null> {
  await requireSession();
  return httpClient.get(`/projects/${id}`);
}

export async function createProject(
  data: CreateProjectSchema,
): Promise<Project> {
  await requireSession();

  const validatedData = createProjectSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }

  const project = await httpClient.post<Project>(
    '/projects',
    validatedData.data,
  );
  revalidatePath('/dashboard');
  return project;
}

export async function updateProject(
  id: string,
  data: UpdateProjectSchema,
): Promise<Project | null> {
  await requireSession();

  const validatedData = updateProjectSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }

  const project = await httpClient.patch<Project | null>(
    `/projects/${id}`,
    validatedData.data,
  );
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/projects/${id}`);
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  await requireSession();
  await httpClient.delete(`/projects/${id}`);
  revalidatePath('/dashboard');
}
