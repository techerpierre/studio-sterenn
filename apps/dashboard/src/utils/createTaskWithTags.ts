import { Tag, Task } from '@sterenn/api-contracts';

import { attachTaskTag } from '@/actions/tag.actions';
import { createTask } from '@/actions/task.actions';
import type { CreateTaskSchema } from '@/validation/task.schemas';

export async function createTaskWithTags(
  projectId: string,
  payload: CreateTaskSchema,
  tags: Tag[],
): Promise<Task> {
  let task = await createTask(projectId, payload);

  for (const tag of tags) {
    task = await attachTaskTag(task.id, tag.id);
  }

  return task;
}
