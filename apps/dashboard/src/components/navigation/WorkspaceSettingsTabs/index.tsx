'use client';

import { SettingsIcon, UsersIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Tabs } from '@/components/ui/Tabs';

export function WorkspaceSettingsTabs() {
  const pathname = usePathname();
  const active = resolveActiveTab(pathname);

  return (
    <Tabs value={active}>
      <Tabs.Item
        value="settings"
        href="/dashboard/workspaces/settings"
      >
        <SettingsIcon size={16} aria-hidden />
        Paramètres
      </Tabs.Item>
      <Tabs.Item
        value="members"
        href="/dashboard/workspaces/settings/members"
      >
        <UsersIcon size={16} aria-hidden />
        Membres
      </Tabs.Item>
    </Tabs>
  );
}

function resolveActiveTab(pathname: string) {
  if (/\/workspaces\/settings\/members\/?$/.test(pathname)) {
    return 'members';
  }
  if (/\/workspaces\/settings\/?$/.test(pathname)) {
    return 'settings';
  }
  return 'list';
}
