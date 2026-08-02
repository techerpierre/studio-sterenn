import type {
  CreateTaskFormSchema,
  CreateTaskSchema,
  UpdateTaskFormSchema,
  UpdateTaskSchema,
} from '@/validation/task.schemas';

function normalizeContent(content: string | undefined): string | undefined {
  return content?.trim();
}

function normalizeOwnerId(ownerId: string | undefined): string | undefined {
  const trimmed = ownerId?.trim();
  return trimmed ? trimmed : undefined;
}

export type BuildCreateTaskPayloadOptions = {
  stateId: string;
  beforeId?: string;
  afterId?: string;
};

export function buildCreateTaskPayload(
  data: CreateTaskFormSchema,
  options: BuildCreateTaskPayloadOptions,
): CreateTaskSchema {
  const content = normalizeContent(data.content);
  const dueDate = data.dueDate?.trim() ? data.dueDate.trim() : undefined;
  const ownerId = normalizeOwnerId(data.ownerId);

  return {
    title: data.title,
    stateId: data.stateId ?? options.stateId,
    content,
    dueDate,
    ...(ownerId ? { ownerId } : {}),
    ...(options.beforeId ? { beforeId: options.beforeId } : {}),
    ...(options.afterId ? { afterId: options.afterId } : {}),
  };
}

export function buildUpdateTaskPayload(
  data: UpdateTaskFormSchema,
): UpdateTaskSchema {
  const content = normalizeContent(data.content);
  const dueDate = data.dueDate?.trim() ? data.dueDate.trim() : null;
  const ownerId = normalizeOwnerId(data.ownerId);

  return {
    title: data.title,
    content,
    dueDate,
    ownerId,
  };
}
