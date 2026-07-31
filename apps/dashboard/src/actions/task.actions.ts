'use server';

import core from '@/config/core';
import { getSession } from '@/lib/session-persistence';
import {
  Board,
  CreateTaskData,
  Task,
  UpdateTaskData,
} from '@sterenn/api-contracts';
import {
  createTaskSchema,
  CreateTaskSchema,
  updateTaskSchema,
  UpdateTaskSchema,
} from '@/validation/task.schemas';

export async function getBoard(projectId: string): Promise<Board> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return core.task.getBoard({ projectId });
}

export async function createTask(
  projectId: string,
  data: CreateTaskSchema,
): Promise<Task> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

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

  return core.task.create(projectId, payload);
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskSchema,
): Promise<Task | null> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const validated = updateTaskSchema.safeParse(data);
  if (!validated.success) {
    throw new Error(validated.error.message);
  }

  const payload: UpdateTaskData = {
    ...validated.data,
  };

  return core.task.update(taskId, payload);
}

export async function deleteTask(taskId: string): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return core.task.delete(taskId);
}

export async function markTaskAsFinished(taskId: string): Promise<Task | null> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return core.task.update(taskId, {
    finished: true,
  });
}
