'use server';

import { requireSession } from '@/actions/auth.actions';
import httpClient from '@/config/httpClient';
import {
  Board,
  CreateTaskData,
  GetBoardParams,
  Task,
  UpdateTaskData,
} from '@sterenn/api-contracts';
import {
  createTaskSchema,
  CreateTaskSchema,
  updateTaskSchema,
  UpdateTaskSchema,
} from '@/validation/task.schemas';

export async function getBoard(
  projectId: string,
  params?: Omit<GetBoardParams, 'projectId'>,
): Promise<Board> {
  await requireSession();

  return httpClient.get(`/projects/${projectId}/board`, {
    params: {
      ...(params?.ownerId ? { ownerId: params.ownerId } : {}),
      ...(params?.tags?.length ? { tags: params.tags } : {}),
    },
    paramsSerializer: {
      indexes: null,
    },
  });
}

export async function createTask(
  projectId: string,
  data: CreateTaskSchema,
): Promise<Task> {
  await requireSession();

  const validated = createTaskSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }

  const payload: CreateTaskData = {
    title: validated.data.title,
    content: validated.data.content,
    stateId: validated.data.stateId,
    dueDate: validated.data.dueDate?.trim()
      ? validated.data.dueDate.trim()
      : null,
    ...(validated.data.ownerId && { ownerId: validated.data.ownerId }),
    ...(validated.data.beforeId && { beforeId: validated.data.beforeId }),
    ...(validated.data.afterId && { afterId: validated.data.afterId }),
  };

  return httpClient.post(`/projects/${projectId}/tasks`, payload);
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskSchema,
): Promise<Task | null> {
  await requireSession();

  const validated = updateTaskSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }

  const payload: UpdateTaskData = {
    ...validated.data,
  };

  return httpClient.patch(`/tasks/${taskId}`, payload);
}

export async function deleteTask(taskId: string): Promise<void> {
  await requireSession();

  return httpClient.delete(`/tasks/${taskId}`);
}

export async function markTaskAsArchived(taskId: string): Promise<Task | null> {
  await requireSession();

  return httpClient.patch(`/tasks/${taskId}`, {
    archived: true,
  } satisfies UpdateTaskData);
}
