'use server';

import { requireSession } from '@/actions/auth.actions';
import httpClient from '@/config/httpClient';
import {
  AttachTaskTagsData,
  CreateTagData,
  ListTagsParams,
  Paginated,
  Tag,
  Task,
  UpdateTagData,
} from '@sterenn/api-contracts';
import {
  createTagSchema,
  CreateTagSchema,
  updateTagSchema,
  UpdateTagSchema,
} from '@/validation/tag.schemas';
import { minimumDelay } from '@/lib/utils';

export async function listTags(
  params: ListTagsParams,
): Promise<Paginated<Tag>> {
  await requireSession();

  return minimumDelay(
    httpClient.get<Paginated<Tag>>('/tags', { params }),
    200,
  );
}

export async function createTag(data: CreateTagSchema): Promise<Tag> {
  await requireSession();

  const validated = createTagSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }

  const payload: CreateTagData = {
    name: validated.data.name,
    color: validated.data.color,
    projectId: validated.data.projectId,
  };

  return httpClient.post('/tags', payload);
}

export async function updateTag(
  tagId: string,
  data: UpdateTagSchema,
): Promise<Tag | null> {
  await requireSession();

  const validated = updateTagSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }

  const payload: UpdateTagData = {
    ...validated.data,
  };

  return httpClient.patch(`/tags/${tagId}`, payload);
}

export async function attachTaskTag(
  taskId: string,
  tagId: string,
): Promise<Task> {
  await requireSession();

  const payload: AttachTaskTagsData = { tagId };
  return httpClient.patch(`/tasks/${taskId}/tags`, payload);
}

export async function detachTaskTag(
  taskId: string,
  tagId: string,
): Promise<Task> {
  await requireSession();

  return httpClient.delete(`/tasks/${taskId}/tags/${tagId}`);
}
