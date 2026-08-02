'use client';

import { ReactNode } from 'react';

import { CreateTagSelectAction } from './CreateTagSelectAction';
import styles from './TagSelectEmpty.module.css';

export type TagSelectEmptyProps = {
  query: string;
  canCreate: boolean;
  onRequestCreate: () => void;
  children?: ReactNode;
};

export function TagSelectEmpty({
  query,
  canCreate,
  onRequestCreate,
  children,
}: TagSelectEmptyProps) {
  if (!canCreate) {
    return children ?? <p className={styles.message}>Aucun tag trouvé</p>;
  }

  return (
    <div className={styles.hint}>
      <p className={styles.message}>Aucun tag trouvé pour<br />« {query} »</p>
      <CreateTagSelectAction
        label={`Créer « ${query} »`}
        onRequestCreate={onRequestCreate}
      />
    </div>
  );
}
