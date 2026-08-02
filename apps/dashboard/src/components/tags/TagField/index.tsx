'use client';

import { Tag } from '@sterenn/api-contracts';

import { TagFieldContent } from './TagFieldContent';
import { TagFieldProvider } from './TagFieldContext';

export type TagFieldProps = {
  projectId: string;
  /** When set, attach/detach are persisted immediately. */
  taskId?: string;
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  disabled?: boolean;
  className?: string;
};

export function TagField({
  projectId,
  taskId,
  value,
  onChange,
  disabled = false,
  className,
}: TagFieldProps) {
  return (
    <TagFieldProvider
      projectId={projectId}
      taskId={taskId}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <TagFieldContent className={className} />
    </TagFieldProvider>
  );
}
