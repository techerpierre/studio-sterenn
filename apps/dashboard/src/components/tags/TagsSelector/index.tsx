'use client';

import { Tag } from '@sterenn/api-contracts';
import { PlusIcon } from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { listTags } from '@/actions/tag.actions';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import clsx from '@/lib/clsx';

import { CreateTagSelectAction } from '../TagField/CreateTagSelectAction';
import { TagSelectEmpty } from '../TagField/TagSelectEmpty';
import { TagSelectOption } from '../TagField/TagSelectOption';
import { TagSelectOptionsSkeleton } from '../TagField/TagSelectOptionsSkeleton';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 200;

export type TagsSelectorProps = {
  projectId: string;
  excludeIds?: string[];
  onSelect: (tag: Tag) => void;
  /** When true, show create CTA if search has no matches. @default false */
  allowCreate?: boolean;
  onRequestCreate?: (name: string) => void;
  disabled?: boolean;
  trigger?: ReactNode;
  className?: string;
  searchPlaceholder?: string;
};

type TagListParams = {
  projectId: string;
  search: string;
};

export function TagsSelector({
  projectId,
  excludeIds = [],
  onSelect,
  allowCreate = false,
  onRequestCreate,
  disabled = false,
  trigger,
  className,
  searchPlaceholder = 'Rechercher un tag',
}: TagsSelectorProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectKey, setSelectKey] = useState(0);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [search]);

  const listParams = useMemo<TagListParams>(
    () => ({ projectId, search: debouncedSearch }),
    [projectId, debouncedSearch],
  );

  const excluded = useMemo(() => new Set(excludeIds), [excludeIds]);

  const { items, isLoading, loadMore } = usePagedQuery<Tag, TagListParams>({
    pageSize: PAGE_SIZE,
    params: listParams,
    fetchPage: ({ page, take, params: query }) => {
      const trimmed = query.search.trim();
      return listTags({
        projectId: query.projectId,
        page,
        take,
        ...(trimmed ? { search: trimmed } : {}),
      });
    },
  });

  const availableOptions = useMemo(
    () => items.filter((tag) => !excluded.has(tag.id)),
    [items, excluded],
  );

  const query = search.trim();
  const canCreate =
    allowCreate &&
    query.length > 0 &&
    availableOptions.length === 0 &&
    !isLoading;

  const handleValueChange = (tagId: string) => {
    const tag = items.find((item) => item.id === tagId);
    if (!tag || excluded.has(tag.id)) return;
    onSelect(tag);
    setSelectKey((key) => key + 1);
    setSearch('');
  };

  const handleRequestCreate = () => {
    onRequestCreate?.(query);
    setSelectKey((key) => key + 1);
    setSearch('');
  };

  return (
    <Select
      key={selectKey}
      className={clsx(className)}
      searchable
      onSearch={setSearch}
      searchPlaceholder={searchPlaceholder}
      matchTriggerWidth={false}
      disabled={disabled}
      onValueChange={handleValueChange}
      onBottom={loadMore}
      emptyPlaceholder={
        <TagSelectOptionsSkeleton loading={isLoading}>
          <TagSelectEmpty
            query={query}
            canCreate={canCreate}
            onRequestCreate={handleRequestCreate}
          />
        </TagSelectOptionsSkeleton>
      }
      trigger={
        trigger ?? (
          <Button
            type="button"
            size="xs"
            icon
            variant="ghost"
            aria-label="Ajouter un tag"
            disabled={disabled}
          >
            <PlusIcon size={16} aria-hidden />
          </Button>
        )
      }
    >
      {availableOptions.map((tag) => (
        <Select.Item key={tag.id} value={tag.id}>
          <TagSelectOption tag={tag} />
        </Select.Item>
      ))}
    </Select>
  );
}
