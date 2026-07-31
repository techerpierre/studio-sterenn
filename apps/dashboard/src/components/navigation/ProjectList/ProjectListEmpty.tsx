import { ReactNode } from 'react';

import { Text } from '@/components/ui/Text';

import styles from './styles.module.css';

export type ProjectListEmptyProps = {
  isEmpty: boolean;
  children: ReactNode;
};

export function ProjectListEmpty({ isEmpty, children }: ProjectListEmptyProps) {
  if (!isEmpty) {
    return children;
  }

  return (
    <Text.BodySmall className={styles.empty}>
      Ce workspace ne possède aucun projets. Créez en un pour commencer
    </Text.BodySmall>
  );
}
