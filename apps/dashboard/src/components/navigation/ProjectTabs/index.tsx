'use client';

import { Columns3Icon, SettingsIcon } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

import { Tabs } from '@/components/ui/Tabs';

export function ProjectTabs() {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const active = resolveActiveTab(pathname);

  return (
    <Tabs value={active}>
      <Tabs.Item
        value="board"
        href={projectId ? `/dashboard/projects/${projectId}` : undefined}
        disabled={!projectId}
      >
        <Columns3Icon size={16} aria-hidden />
        Table
      </Tabs.Item>
      <Tabs.Item
        value="settings"
        href={
          projectId ? `/dashboard/projects/${projectId}/settings` : undefined
        }
        disabled={!projectId}
      >
        <SettingsIcon size={16} aria-hidden />
        Paramètres
      </Tabs.Item>
    </Tabs>
  );
}

function resolveActiveTab(pathname: string) {
  if (/\/dashboard\/projects\/[^/]+\/settings\/?$/.test(pathname)) {
    return 'settings';
  }
  if (/\/dashboard\/projects\/[^/]+\/?$/.test(pathname)) {
    return 'board';
  }
  return 'board';
}
