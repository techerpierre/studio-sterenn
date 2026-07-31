'use server';

import core from '@/config/core';
import { getSession } from '@/lib/session-persistence';
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
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

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

  return core.taskState.create(projectId, payload);
}

export async function updateTaskState(
  stateId: string,
  data: UpdateTaskStateSchema,
): Promise<TaskState | null> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const validated = updateTaskStateSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }

  const payload: UpdateTaskStateData = {
    ...validated.data,
  };

  return core.taskState.update(stateId, payload);
}

export async function deleteTaskState(stateId: string): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return core.taskState.delete(stateId);
}
