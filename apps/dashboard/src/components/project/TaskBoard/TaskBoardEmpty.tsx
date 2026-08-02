import { ReactNode } from 'react';

import { createEmptyGate } from '@/components/logics';
import { Text } from '@/components/ui/Text';

import styles from './TaskBoardEmpty.module.css';

export type TaskBoardEmptyViewProps = {
  action?: ReactNode;
};

function TaskBoardEmptyView({ action }: TaskBoardEmptyViewProps) {
  return (
    <div className={styles.empty}>
      <Text.BodySmall>
        Ce projet ne possède aucune colonne. Créez-en une pour commencer.
      </Text.BodySmall>
      {action}
    </div>
  );
}

export const TaskBoardEmpty = createEmptyGate(TaskBoardEmptyView);
