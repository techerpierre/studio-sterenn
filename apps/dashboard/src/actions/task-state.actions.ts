'use server';

import { requireSession } from '@/actions/auth.actions';
import httpClient from '@/config/httpClient';
import {
  CreateTaskStateData,
  TaskState,
  UpdateTaskStateData,
} from '@sterenn/api-contracts';
import {
  createTaskStateSchema,
  CreateTaskStateSchema,
  updateTaskStateSchema,
  UpdateTaskStateSchema,
} from '@/validation/task-state.schemas';

export async function createTaskState(
  projectId: string,
  data: CreateTaskStateSchema,
): Promise<TaskState> {
  await requireSession();

  const validated = createTaskStateSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }

  const payload: CreateTaskStateData = {
    name: validated.data.name,
    color: validated.data.color,
    ...(validated.data.beforeId && { beforeId: validated.data.beforeId }),
    ...(validated.data.afterId && { afterId: validated.data.afterId }),
  };

  return httpClient.post(`/projects/${projectId}/states`, payload);
}

export async function updateTaskState(
  stateId: string,
  data: UpdateTaskStateSchema,
): Promise<TaskState | null> {
  await requireSession();

  const validated = updateTaskStateSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }

  const payload: UpdateTaskStateData = {
    ...validated.data,
  };

  return httpClient.patch(`/task-states/${stateId}`, payload);
}

export async function deleteTaskState(stateId: string): Promise<void> {
  await requireSession();

  return httpClient.delete(`/task-states/${stateId}`);
}
