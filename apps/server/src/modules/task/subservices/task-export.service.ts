import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { TaskService } from '../task.service';
import {
  Board,
  Task,
  TaskExportEventStatus,
  TaskExportParams,
  TaskExportResult,
  TaskExportSseEvent,
  TaskExportType,
} from '../task.types';
import { StorageService } from '@/modules/storage/storage.service';
import { ZipArchive } from 'archiver';
import { finished } from 'node:stream/promises';
import { Queue, QueueEvents } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { TaskAction, TaskQueueName } from '../task.constants';
import { MembershipService } from '@/modules/membership/membership.service';
import { Observable } from 'rxjs';
import env from '@/config/env';

@Injectable()
export class TaskExportService implements OnModuleDestroy {
  static readonly SecureFilenameRegex = /[/\\?%*:|"<>]/g;

  private readonly exportFuncTable: Record<
    TaskExportType,
    (board: Board) => Promise<Buffer>
  > = {
    [TaskExportType.MARKDOWN]: (board) => this.exportMarkdown(board),
    [TaskExportType.JSON]: (board) => this.exportJson(board),
  };

  private readonly queueEvents: QueueEvents;

  constructor(
    private readonly taskService: TaskService,
    private readonly storageService: StorageService,
    private readonly membershipService: MembershipService,
    @InjectQueue(TaskQueueName)
    private readonly taskQueue: Queue,
  ) {
    this.queueEvents = new QueueEvents(TaskQueueName, {
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.queueEvents.close();
  }

  exportBoardSse(params: TaskExportParams): Observable<TaskExportSseEvent> {
    return new Observable((subscriber) => {
      let cancelled = false;

      const run = async () => {
        if (params.userId) {
          await this.membershipService.assertProjectMember({
            userId: params.userId,
            projectId: params.projectId,
          });
        }

        if (cancelled) return;

        subscriber.next({
          status: TaskExportEventStatus.Processing,
          ressourceUrl: null,
        });

        const job = await this.taskQueue.add(TaskAction.ExportBoard, {
          projectId: params.projectId,
          type: params.type,
        } satisfies TaskExportParams);

        const result = (await job.waitUntilFinished(
          this.queueEvents,
        )) as TaskExportResult;

        if (cancelled) return;

        subscriber.next({
          status: TaskExportEventStatus.Completed,
          ressourceUrl: result.ressourceUrl,
        });
        subscriber.complete();
      };

      run().catch((error: unknown) => {
        if (cancelled) return;

        subscriber.next({
          status: TaskExportEventStatus.Failed,
          ressourceUrl: null,
          message:
            error instanceof Error ? error.message : 'Board export failed',
        });
        subscriber.complete();
      });

      return () => {
        cancelled = true;
      };
    });
  }

  async exportBoard(params: TaskExportParams): Promise<TaskExportResult> {
    const board = await this.taskService.getBoard({
      projectId: params.projectId,
    });
    const buffer = await this.exportFuncTable[params.type](board);
    const contentType = 'application/zip';

    const { ressourceUrl } = await this.storageService.uploadFile(
      `exports/${params.projectId}-${params.type}.zip`,
      {
        data: buffer,
        contentType,
      },
    );

    return { ressourceUrl };
  }

  private async exportMarkdown(board: Board): Promise<Buffer> {
    const files: Array<{ name: string; data: string }> = [];

    for (const state of board.states) {
      const folderName = state.name.replace(
        TaskExportService.SecureFilenameRegex,
        '-',
      );

      for (const task of state.tasks) {
        const fileName =
          task.title.replace(TaskExportService.SecureFilenameRegex, '-') +
          '.md';
        files.push({
          name: `${folderName}/${fileName}`,
          data: this.getMarkdownTask(task, state.name),
        });
      }
    }

    return this.toZipBuffer(files);
  }

  private async exportJson(board: Board): Promise<Buffer> {
    return this.toZipBuffer([
      {
        name: 'board.json',
        data: JSON.stringify(board, null, 2),
      },
    ]);
  }

  private getMarkdownTask(task: Task, stateName: string): string {
    return [
      `# ${task.title}`,
      '\n---\n',
      `Tags: ${task.tags.map((tag) => tag.name).join(', ')}\n`,
      `State: ${stateName}\n\n`,
      task.content,
      '\n---\n',
      `Due Date: ${task.dueDate ? new Date(task.dueDate).toISOString() : 'N/A'}\n`,
      `Assigned To: ${task.ownerId ? task.ownerId : 'N/A'}\n`,
    ].join('');
  }

  private async toZipBuffer(
    files: Array<{ name: string; data: string | Buffer }>,
  ): Promise<Buffer> {
    const archive = new ZipArchive({ zlib: { level: 9 } });
    const chunks: Buffer[] = [];
    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    for (const file of files) {
      archive.append(file.data, { name: file.name });
    }
    await archive.finalize();
    await finished(archive);
    return Buffer.concat(chunks);
  }
}
