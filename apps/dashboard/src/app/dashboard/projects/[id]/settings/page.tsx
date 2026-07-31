'use client';

import { PageHeader } from '@/app/dashboard/workspaces/settings/layouts/PageHeader';
import { useProject } from '@/contexts/ProjectContext';

export default function ProjectSettingsPage() {
  const { project } = useProject();

  return (
    <PageHeader title={`Paramètres de « ${project.name} »`}/>
  );
}
