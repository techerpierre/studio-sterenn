'use client';

import { PlusIcon } from 'lucide-react';

import { TaskStateForm } from '@/components/forms/TaskStateForm';
import { Button } from '@/components/ui/Button';

import styles from './TaskBoardColumnInsert.module.css';

export type TaskBoardColumnInsertProps = {
  projectId: string;
  beforeId?: string;
  afterId?: string;
};

export function TaskBoardColumnInsert({
  projectId,
  beforeId,
  afterId,
}: TaskBoardColumnInsertProps) {
  return (
    <div className={styles.insert}>
      <div className={styles.hitArea}>
        <TaskStateForm
          projectId={projectId}
          beforeId={beforeId}
          afterId={afterId}
          trigger={
            <Button
              type="button"
              size="sm"
              icon
              className={styles.trigger}
              aria-label="Insérer une colonne"
            >
              <PlusIcon size={14} aria-hidden />
            </Button>
          }
        />
      </div>
    </div>
  );
}
