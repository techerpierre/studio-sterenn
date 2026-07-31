"use client";

import clsx from "@/lib/clsx";
import {
  Building2Icon,
  ChevronsUpDownIcon,
  RepeatIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { MEMBERSHIP_ROLE_LABELS } from "@/constants/mapping";
import { useWorkspace } from "@/contexts/WorkspaceContext";

import styles from "./styles.module.css";
import { RoleGuard } from "@/components/guards/RoleGuard";
import { MembershipRole } from "@sterenn/api-contracts";

export type WorkspaceSwitcherProps = {
  className?: string;
};

export function WorkspaceSwitcher({ className }: WorkspaceSwitcherProps) {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const roleLabel = currentWorkspace?.role
    ? MEMBERSHIP_ROLE_LABELS[currentWorkspace.role]
    : null;

  return (
    <div className={clsx(styles.wrap, className)}>
      <Dropdown
        align="filled"
        trigger={
          <button type="button" className={styles.trigger}>
            <span className={styles.iconWrap}>
              <Building2Icon size={16} aria-hidden className={styles.icon} />
            </span>
            <span className={styles.meta}>
              <span className={styles.name}>
                {currentWorkspace?.name ?? "Workspace"}
              </span>
              {roleLabel ? (
                <Badge size="sm" className={styles.role}>
                  {roleLabel}
                </Badge>
              ) : null}
            </span>
            <ChevronsUpDownIcon
              size={16}
              aria-hidden
              className={styles.chevron}
            />
          </button>
        }
      >
        <Dropdown.Item onClick={() => router.push("/workspaces")}>
          <RepeatIcon size={16} aria-hidden />
          Changer de workspace
        </Dropdown.Item>
        <RoleGuard accept={MembershipRole.ADMIN}>
          <Dropdown.Section
            label={currentWorkspace?.name ?? "Workspace actuel"}
          >
            <Dropdown.Item
              onClick={() =>
                router.push(`/dashboard/workspaces/settings`)
              }
            >
              <SettingsIcon size={16} aria-hidden />
              Paramètres
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                router.push(
                  `/dashboard/workspaces/settings/members`,
                )
              }
            >
              <UsersIcon size={16} aria-hidden />
              Membres
            </Dropdown.Item>
          </Dropdown.Section>
        </RoleGuard>
      </Dropdown>
    </div>
  );
}
