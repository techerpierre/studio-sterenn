import * as Contracts from '@sterenn/api-contracts';

import type { Task, TaskExportSseEvent } from './task.types';
import { TaskExportEventStatus } from './task.types';

export function toTaskContract(task: Task): Contracts.Task {
  return {
    id: task.id,
    title: task.title,
    content: task.content,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    position: task.position,
    projectId: task.projectId,
    ownerId: task.ownerId,
    stateId: task.stateId,
    tags: task.tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      projectId: tag.projectId,
    })),
    owner: {
      id: task.owner.id,
      firstName: task.owner.firstName,
      lastName: task.owner.lastName,
    },
  };
}

const exportStatusToContract: Record<
  TaskExportEventStatus,
  Contracts.EventStatus
> = {
  [TaskExportEventStatus.Processing]: Contracts.EventStatus.Processing,
  [TaskExportEventStatus.Completed]: Contracts.EventStatus.Completed,
  [TaskExportEventStatus.Failed]: Contracts.EventStatus.Failed,
};

export function toTaskExportEventContract(
  event: TaskExportSseEvent,
): Contracts.TaskExportEventData {
  return {
    status: exportStatusToContract[event.status],
    data: {
      ressourceUrl: event.ressourceUrl,
    },
    ...(event.message ? { message: event.message } : {}),
  };
}
