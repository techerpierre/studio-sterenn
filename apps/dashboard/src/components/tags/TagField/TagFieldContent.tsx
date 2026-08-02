'use client';

import { TagForm } from '@/components/forms/TagForm';
import { TagChip } from '@/components/tags/TagChip';
import { TagsSelector } from '@/components/tags/TagsSelector';
import clsx from '@/lib/clsx';

import styles from './TagField.module.css';
import { useTagField } from './TagFieldContext';
import { TagFieldEmpty } from './TagFieldEmpty';

export type TagFieldContentProps = {
  className?: string;
};

export function TagFieldContent({ className }: TagFieldContentProps) {
  const {
    projectId,
    value,
    disabled,
    busyTagId,
    createRequest,
    createTriggerRef,
    removeTag,
    addTag,
    requestCreateTag,
    handleTagCreated,
  } = useTagField();

  return (
    <div className={clsx(styles.list, className)}>
      <TagFieldEmpty isEmpty={value.length === 0}>
        {value.map((tag) => (
          <TagChip
            key={tag.id}
            tag={tag}
            disabled={disabled}
            busy={busyTagId === tag.id}
            onRemove={(tagId) => void removeTag(tagId)}
          />
        ))}
      </TagFieldEmpty>

      <TagsSelector
        className={styles.addTag}
        projectId={projectId}
        excludeIds={value.map((tag) => tag.id)}
        onSelect={addTag}
        allowCreate
        onRequestCreate={requestCreateTag}
        disabled={disabled}
      />

      <TagForm
        key={createRequest?.id ?? 'tag-form-idle'}
        projectId={projectId}
        initialName={createRequest?.name ?? ''}
        onSaved={handleTagCreated}
        trigger={
          <button
            ref={createTriggerRef}
            type="button"
            className={styles.hiddenTrigger}
            tabIndex={-1}
            aria-hidden
          />
        }
      />
    </div>
  );
}
