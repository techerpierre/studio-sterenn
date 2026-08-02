import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TaskExportService } from './subservices/task-export.service';
import { TaskExportParams, TaskExportResult } from './task.types';
import { TaskAction, TaskQueueName } from './task.constants';

@Processor(TaskQueueName)
export class TaskProcessor extends WorkerHost {
  constructor(private readonly taskExportService: TaskExportService) {
    super();
  }

  async process(job: Job): Promise<TaskExportResult | void> {
    switch (job.name) {
      case TaskAction.ExportBoard:
        return this.exportBoard(job.data);
    }
  }

  private async exportBoard(
    data: TaskExportParams,
  ): Promise<TaskExportResult> {
    return this.taskExportService.exportBoard(data);
  }
}
