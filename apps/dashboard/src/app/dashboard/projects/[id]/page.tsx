'use client';

import { useRef } from 'react';

import {
  TaskBoard,
  TaskBoardHeader,
  type TaskBoardHandle,
} from '@/components/project/TaskBoard';
import { Box } from '@/components/ui/Box';

import styles from './page.module.css';

export default function ProjectBoardPage() {
  const boardRef = useRef<TaskBoardHandle>(null);

  return (
    <Box direction="column" gap={16}>
      <TaskBoardHeader
        onScrollColumns={(direction) =>
          boardRef.current?.scrollColumns(direction)
        }
      />
      <div className={styles.taskBoardContainer}>
        <TaskBoard ref={boardRef} />
      </div>
    </Box>
  );
}
