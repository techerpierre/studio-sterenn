'use client';

import { MembershipRole } from '@sterenn/api-contracts';
import { ReactNode } from 'react';

import { useWorkspace } from '@/contexts/WorkspaceContext';

export type RoleGuardProps = {
  children: ReactNode;
  accept: MembershipRole | MembershipRole[];
};

export function RoleGuard({ children, accept }: RoleGuardProps) {
  const { currentWorkspace } = useWorkspace();
  const acceptedRoles = Array.isArray(accept) ? accept : [accept];

  if (!currentWorkspace?.role || !acceptedRoles.includes(currentWorkspace.role)) {
    return null;
  }

  return children;
}
