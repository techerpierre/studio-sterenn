import { ReactNode } from 'react';

import { Text } from '@/components/ui/Text';

import styles from './TaskBoardEmpty.module.css';

export type TaskBoardEmptyProps = {
  isEmpty: boolean;
  children: ReactNode;
  action?: ReactNode;
};

export function TaskBoardEmpty({
  isEmpty,
  children,
  action,
}: TaskBoardEmptyProps) {
  if (!isEmpty) {
    return children;
  }

  return (
    <div className={styles.empty}>
      <Text.BodySmall>
        Ce projet ne possède aucune colonne. Créez-en une pour commencer.
      </Text.BodySmall>
      {action}
    </div>
  );
}
