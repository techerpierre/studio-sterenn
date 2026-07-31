import { Navbar } from '@/components/navigation/Navbar';
import { DashboardMenu } from '@/components/navigation/DashboardMenu';
import { Box } from '@/components/ui/Box';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProjectListProvider } from '@/contexts/ProjectListContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { getProfile } from '@/actions/auth.actions';
import { getWorkspaceSelectorData } from '@/actions/workspace.actions';

import styles from './layout.module.css';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ workspaces, count, currentWorkspace, shouldPersistCurrent }, user] =
    await Promise.all([getWorkspaceSelectorData(), getProfile()]);

  return (
    <AuthProvider initialUser={user}>
      <WorkspaceProvider
        initialWorkspaces={workspaces}
        initialCurrentWorkspace={currentWorkspace}
        initialTotalCount={count}
        shouldPersistCurrent={shouldPersistCurrent}
      >
        <ProjectListProvider>
          <Navbar />
          <Box className={styles.body}>
            <DashboardMenu />
            <Box as="main" className={styles.main}>
              {children}
            </Box>
          </Box>
        </ProjectListProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
