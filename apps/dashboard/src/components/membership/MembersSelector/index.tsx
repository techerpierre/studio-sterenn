'use client';

import { Member, User } from '@sterenn/api-contracts';
import { UserPlusIcon } from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { listMembers } from '@/actions/membership.actions';
import { getUser } from '@/actions/user.actions';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import clsx from '@/lib/clsx';

import styles from './styles.module.css';

const PAGE_SIZE = 20;

export type MembersSelectorProps = {
  workspaceId: string;
  value?: string;
  onValueChange?: (memberId: string) => void;
  /** Label when no member is selected. @default "Assigner cette tâche" */
  emptyLabel?: ReactNode;
  /** Label when a member is selected — receives their display name. */
  assignedLabel: (displayName: string) => ReactNode;
  disabled?: boolean;
  className?: string;
};

function displayName(member: Pick<User, 'firstName' | 'lastName' | 'email'>) {
  const name = `${member.firstName} ${member.lastName}`.trim();
  return name || member.email;
}

export function MembersSelector({
  workspaceId,
  value,
  onValueChange,
  emptyLabel = 'Assigner cette tâche',
  assignedLabel,
  disabled = false,
  className,
}: MembersSelectorProps) {
  const [selected, setSelected] = useState<User | null>(null);

  const params = useMemo(() => ({ workspaceId }), [workspaceId]);

  const { items: members, isLoading, hasMore, loadMore } = usePagedQuery<
    Member,
    { workspaceId: string }
  >({
    pageSize: PAGE_SIZE,
    params,
    fetchPage: ({ page, take, params: query }) =>
      listMembers({
        workspaceId: query.workspaceId,
        page,
        take,
      }),
  });

  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }

    const fromList = members.find((member) => member.id === value);
    if (fromList) {
      setSelected(fromList);
      return;
    }

    let cancelled = false;
    void getUser(value).then((user) => {
      if (cancelled || !user) return;
      setSelected(user);
    });

    return () => {
      cancelled = true;
    };
  }, [value, members]);

  const handleBottom = () => {
    if (isLoading || !hasMore) return;
    loadMore();
  };

  const selectedName = selected ? displayName(selected) : '';

  return (
    <Select
      className={clsx(styles.root, className)}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      searchable
      searchPlaceholder="Rechercher un membre"
      emptyPlaceholder="Aucun membre trouvé"
      matchTriggerWidth
      onBottom={handleBottom}
      trigger={
        value && selected ? (
          <span className={styles.field}>
            <Avatar name={selectedName} size="sm" />
            <span className={styles.assignedLabel}>
              {assignedLabel(selectedName)}
            </span>
          </span>
        ) : value ? (
          <span className={styles.field}>
            <Avatar size="sm" />
            <span className={styles.assignedLabel}>{assignedLabel('…')}</span>
          </span>
        ) : (
          <span className={styles.field}>
            <UserPlusIcon size={14} aria-hidden />
            <span className={styles.placeholder}>{emptyLabel}</span>
          </span>
        )
      }
    >
      {members.map((member) => {
        const name = displayName(member);
        return (
          <Select.Item key={member.id} value={member.id}>
            <span className={styles.option}>
              <Avatar name={name} size="sm" />
              <span className={styles.optionText}>
                <span className={styles.optionName}>{name}</span>
                <span className={styles.optionEmail}>{member.email}</span>
              </span>
            </span>
          </Select.Item>
        );
      })}
    </Select>
  );
}
