'use client';

import { Tag } from '@sterenn/api-contracts';
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { attachTaskTag, detachTaskTag } from '@/actions/tag.actions';
import { useActionFeedback } from '@/hooks/useActionFeedback';

export type TagFieldContextType = {
  projectId: string;
  taskId?: string;
  value: Tag[];
  disabled: boolean;
  busyTagId: string | null;
  createRequest: { name: string; id: number } | null;
  createTriggerRef: RefObject<HTMLButtonElement | null>;
  removeTag: (tagId: string) => void;
  addTag: (tag: Tag) => void;
  requestCreateTag: (name: string) => void;
  handleTagCreated: (tag: Tag) => void;
};

const TagFieldContext = createContext<TagFieldContextType | null>(null);

export type TagFieldProviderProps = PropsWithChildren<{
  projectId: string;
  taskId?: string;
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  disabled?: boolean;
}>;

export function TagFieldProvider({
  children,
  projectId,
  taskId,
  value,
  onChange,
  disabled = false,
}: TagFieldProviderProps) {
  const { run } = useActionFeedback();
  const [createRequest, setCreateRequest] = useState<{
    name: string;
    id: number;
  } | null>(null);
  const [busyTagId, setBusyTagId] = useState<string | null>(null);
  const createTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!createRequest) return;
    createTriggerRef.current?.click();
  }, [createRequest]);

  const selectedIds = useMemo(
    () => new Set(value.map((tag) => tag.id)),
    [value],
  );

  const persistAttach = useCallback(
    async (tag: Tag) => {
      if (!taskId) {
        if (selectedIds.has(tag.id)) return;
        onChange([...value, tag]);
        return;
      }

      setBusyTagId(tag.id);
      const updated = await run(() => attachTaskTag(taskId, tag.id), {
        errorTitle: 'Ajout du tag échoué',
        errorDescription: 'Impossible d’associer ce tag à la tâche.',
      });
      setBusyTagId(null);
      if (updated) {
        onChange(updated.tags);
      }
    },
    [taskId, value, onChange, run, selectedIds],
  );

  const removeTag = useCallback(
    async (tagId: string) => {
      if (!taskId) {
        onChange(value.filter((tag) => tag.id !== tagId));
        return;
      }

      setBusyTagId(tagId);
      const updated = await run(() => detachTaskTag(taskId, tagId), {
        errorTitle: 'Retrait du tag échoué',
        errorDescription: 'Impossible de retirer ce tag de la tâche.',
      });
      setBusyTagId(null);
      if (updated) {
        onChange(updated.tags);
      }
    },
    [taskId, value, onChange, run],
  );

  const addTag = useCallback(
    (tag: Tag) => {
      void persistAttach(tag);
    },
    [persistAttach],
  );

  const handleTagCreated = useCallback(
    (tag: Tag) => {
      void persistAttach(tag);
      setCreateRequest(null);
    },
    [persistAttach],
  );

  const requestCreateTag = useCallback((name: string) => {
    setCreateRequest({ name, id: Date.now() });
  }, []);

  const value_ctx = useMemo<TagFieldContextType>(
    () => ({
      projectId,
      taskId,
      value,
      disabled,
      busyTagId,
      createRequest,
      createTriggerRef,
      removeTag,
      addTag,
      requestCreateTag,
      handleTagCreated,
    }),
    [
      projectId,
      taskId,
      value,
      disabled,
      busyTagId,
      createRequest,
      removeTag,
      addTag,
      requestCreateTag,
      handleTagCreated,
    ],
  );

  return (
    <TagFieldContext.Provider value={value_ctx}>
      {children}
    </TagFieldContext.Provider>
  );
}

export function useTagField() {
  const context = useContext(TagFieldContext);
  if (!context) {
    throw new Error('useTagField must be used within a TagFieldProvider');
  }
  return context;
}
