'use client';

import { ReactNode } from 'react';

import { Separator } from '../Separator';
import styles from './SelectSection.module.css';

export type SelectSectionProps = {
  label: string;
  children: ReactNode;
};

export function SelectSection({ label, children }: SelectSectionProps) {
  return (
    <>
      <Separator
        label={label}
        left={false}
        right
        className={styles.separator}
      />
      {children}
    </>
  );
}
