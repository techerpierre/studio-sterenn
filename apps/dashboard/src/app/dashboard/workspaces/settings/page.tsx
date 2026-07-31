'use client';

import { useWorkspace } from '@/contexts/WorkspaceContext';

import { PageHeader } from './layouts/PageHeader';

export default function WorkspaceSettingsPage() {
  const { currentWorkspace } = useWorkspace();

  return (
    <PageHeader
      title={`Parametres de « ${currentWorkspace?.name ?? ''} »`}
    />
  );
}
