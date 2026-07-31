import { ReactNode } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';

import styles from './styles.module.css';

export type PageHeaderProps = {
  title: string;
  actions?: ReactNode;
  right?: ReactNode;
};

export function PageHeader({ title, actions, right }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <Box align="center" gap={12} className={styles.titleGroup}>
        <Text.FourthHeading as="h1">{title}</Text.FourthHeading>
        {actions}
      </Box>
      {right ? <div className={styles.right}>{right}</div> : null}
    </header>
  );
}
