'use client';

import clsx from '@/lib/clsx';
import { ChevronDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { CreateProjectForm } from '@/components/forms/CreateProjectForm';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useProjectList } from '@/contexts/ProjectListContext';

import { ProjectListEmpty } from './ProjectListEmpty';
import { ProjectListSkeleton } from './ProjectListSkeleton';
import styles from './styles.module.css';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { MembershipRole } from '@sterenn/api-contracts';

export type ProjectListProps = {
  className?: string;
};

export function ProjectList({ className }: ProjectListProps) {
  const router = useRouter();
  const {
    workspaceId,
    projects,
    loading,
    hasMore,
    isInitialLoading,
    activeProjectId,
    loadMore,
    addProject,
  } = useProjectList();

  if (!workspaceId) {
    return null;
  }

  return (
    <Box
      direction="column"
      gap={8}
      className={clsx(styles.root, className)}
    >
      <Box align="center" justify="between" className={styles.header}>
        <Text.Body className={styles.title}>Projets</Text.Body>
        <RoleGuard accept={MembershipRole.ADMIN}>
          <CreateProjectForm onCreated={addProject} />
        </RoleGuard>
      </Box>

      <Box
        as="nav"
        direction="column"
        gap={4}
        className={clsx(styles.list, 'scrollbar-minimal')}
        aria-label="Projets"
      >
        <ProjectListSkeleton loading={isInitialLoading} count={5}>
          <ProjectListEmpty isEmpty={!loading && projects.length === 0}>
            {projects.map((project) => {
              const active = project.id === activeProjectId;

              return (
                <Button
                  key={project.id}
                  type="button"
                  variant="ghost"
                  rounded
                  aria-current={active ? 'page' : undefined}
                  className={clsx(styles.item, active && styles.active)}
                  onClick={() =>
                    router.push(`/dashboard/projects/${project.id}`)
                  }
                >
                  <span className={styles.label}>{project.name}</span>
                </Button>
              );
            })}

            {hasMore ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className={styles.loadMore}
                aria-label="Charger les projets suivants"
                loading={loading}
                disabled={loading}
                onClick={() => void loadMore()}
              >
                <ChevronDownIcon size={16} aria-hidden />
              </Button>
            ) : null}
          </ProjectListEmpty>
        </ProjectListSkeleton>
      </Box>
    </Box>
  );
}
