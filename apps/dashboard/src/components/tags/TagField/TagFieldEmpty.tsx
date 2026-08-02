'use client';

import { createEmptyGate } from '@/components/logics';

import styles from './TagFieldEmpty.module.css';

function TagFieldEmptyView() {
  return <span className={styles.empty}>Aucun tags</span>;
}

export const TagFieldEmpty = createEmptyGate(TagFieldEmptyView);
