'use client';

import { Tag } from '@sterenn/api-contracts';

import styles from './TagSelectOption.module.css';

export type TagSelectOptionProps = {
  tag: Tag;
};

export function TagSelectOption({ tag }: TagSelectOptionProps) {
  return (
    <span className={styles.option}>
      <span
        className={styles.dot}
        style={{ background: tag.color }}
        aria-hidden
      />
      {tag.name}
    </span>
  );
}
