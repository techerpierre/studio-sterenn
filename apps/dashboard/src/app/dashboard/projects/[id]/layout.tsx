import { notFound } from 'next/navigation';

import { getProject } from '@/actions/project.actions';
import { getBoard } from '@/actions/task.actions';
import { ProjectTabs } from '@/components/navigation/ProjectTabs';
import { Box } from '@/components/ui/Box';
import { ProjectProvider } from '@/contexts/ProjectContext';
import clsx from '@/lib/clsx';

import styles from './layout.module.css';

type ProjectLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { id } = await params;
  const [project, board] = await Promise.all([getProject(id), getBoard(id)]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectProvider initialProject={project} initialBoard={board}>
      <Box direction="column" gap={24} padding={24} className={clsx(styles.container, 'scrollbar-minimal')}>
        <ProjectTabs />
        {children}
      </Box>
    </ProjectProvider>
  );
}
