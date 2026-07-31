'use client';

import { ReactNode } from 'react';

import { Separator } from '../Separator';
import styles from './DropdownSection.module.css';

export type DropdownSectionProps = {
  label: string;
  children: ReactNode;
};

export function DropdownSection({ label, children }: DropdownSectionProps) {
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
