import { WorkspaceSettingsTabs } from '@/components/navigation/WorkspaceSettingsTabs';
import { Box } from '@/components/ui/Box';

import styles from './layout.module.css';

export default function WorkspacesSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box direction="column" gap={24} padding={24} className={styles.container}>
      <WorkspaceSettingsTabs />
      {children}
    </Box>
  );
}
