'use client';

import { Button } from '@/components/ui/Button';
import { useWorkspace } from '@/contexts/WorkspaceContext';

import { PageHeader } from '../layouts/PageHeader';

export default function WorkspaceMembersPage() {
  const { currentWorkspace } = useWorkspace();

  return (
    <PageHeader
      title={`Membres de « ${currentWorkspace?.name ?? ''} »`}
      right={<Button variant="default">+ Ajouter un membre</Button>}
    />
  );
}
