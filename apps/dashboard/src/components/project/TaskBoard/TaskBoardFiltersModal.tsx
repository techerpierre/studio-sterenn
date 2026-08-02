"use client";

import { Tag } from "@sterenn/api-contracts";
import { FilterIcon, RotateCcwIcon } from "lucide-react";
import { SyntheticEvent, useEffect, useRef, useState } from "react";

import { listTags } from "@/actions/tag.actions";
import { When } from "@/components/logics";
import { MembersSelector } from "@/components/membership/MembersSelector";
import { TagChip } from "@/components/tags/TagChip";
import { TagsSelector } from "@/components/tags/TagsSelector";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createModalComponent, Modal, useModal } from "@/components/ui/Modal";
import { useBoard, type BoardFilters } from "@/contexts/BoardContext";
import { useProject } from "@/contexts/ProjectContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";

import styles from "./TaskBoardFiltersModal.module.css";

const FORM_ID = "task-board-filters-form";

export type TaskBoardFiltersModalProps = {
  className?: string;
};

export const TaskBoardFiltersModal = createModalComponent(
  function TaskBoardFiltersModal({ className }: TaskBoardFiltersModalProps) {
    const { close, open } = useModal();
    const { project } = useProject();
    const { currentWorkspace } = useWorkspace();
    const { filters, refreshBoard } = useBoard();
    const workspaceId = currentWorkspace?.id;
    const projectId = project.id;

    const [ownerId, setOwnerId] = useState(filters.ownerId ?? "");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [isApplying, setIsApplying] = useState(false);
    const tagCacheRef = useRef<Map<string, Tag>>(new Map());

    const hasDraftFilters =
      ownerId.length > 0 || selectedTags.length > 0;
    const hasActiveFilters = Boolean(
      filters.ownerId || (filters.tags && filters.tags.length > 0),
    );

    useEffect(() => {
      if (!open) return;

      setOwnerId(filters.ownerId ?? "");

      const ids = filters.tags ?? [];
      if (ids.length === 0) {
        setSelectedTags([]);
        return;
      }

      const fromCache = ids
        .map((id) => tagCacheRef.current.get(id))
        .filter((tag): tag is Tag => Boolean(tag));

      if (fromCache.length === ids.length) {
        setSelectedTags(fromCache);
        return;
      }

      let cancelled = false;
      void listTags({ projectId, page: 1, take: 100 }).then((page) => {
        if (cancelled) return;
        for (const tag of page.results) {
          tagCacheRef.current.set(tag.id, tag);
        }
        setSelectedTags(
          ids
            .map((id) => tagCacheRef.current.get(id))
            .filter((tag): tag is Tag => Boolean(tag)),
        );
      });

      return () => {
        cancelled = true;
      };
    }, [open, filters.ownerId, filters.tags, projectId]);

    const applyFilters = async (next: BoardFilters) => {
      setIsApplying(true);
      try {
        await refreshBoard(next);
        close();
      } finally {
        setIsApplying(false);
      }
    };

    const handleSubmit = async (event: SyntheticEvent) => {
      event.preventDefault();
      const tagIds = selectedTags.map((tag) => tag.id);
      await applyFilters({
        ...(ownerId ? { ownerId } : {}),
        ...(tagIds.length ? { tags: tagIds } : {}),
      });
    };

    const handleReset = async () => {
      setOwnerId("");
      setSelectedTags([]);
      await applyFilters({});
    };

    const handleSelectTag = (tag: Tag) => {
      tagCacheRef.current.set(tag.id, tag);
      setSelectedTags((current) =>
        current.some((item) => item.id === tag.id)
          ? current
          : [...current, tag],
      );
    };

    const handleRemoveTag = (tagId: string) => {
      setSelectedTags((current) =>
        current.filter((tag) => tag.id !== tagId),
      );
    };

    return (
      <Modal
        className={className}
        title="Filtres"
        size="sm"
        fill={false}
        trigger={
          <Button
            type="button"
            icon
            variant={hasActiveFilters ? "muted" : "ghost"}
            aria-label="Filtrer le tableau"
          >
            <FilterIcon size={16} aria-hidden />
          </Button>
        }
        footer={
          <>
            <When condition={hasDraftFilters}>
              <Button
                type="button"
                variant="outline"
                disabled={isApplying}
                onClick={() => void handleReset()}
              >
                <RotateCcwIcon size={16} aria-hidden />
                <span>Réinitialiser</span>
              </Button>
            </When>
            <Button
              type="submit"
              form={FORM_ID}
              loading={isApplying}
              disabled={!projectId}
            >
              Appliquer
            </Button>
          </>
        }
      >
        <Box
          as="form"
          id={FORM_ID}
          direction="column"
          gap={16}
          onSubmit={(event) => void handleSubmit(event)}
        >
          <When condition={Boolean(workspaceId)}>
            <FormField
              label="Assigné à"
              caption="Afficher uniquement les tâches assignées à ce membre."
            >
              <MembersSelector
                workspaceId={workspaceId!}
                value={ownerId || undefined}
                onValueChange={setOwnerId}
                emptyLabel="Tous les membres"
                assignedLabel={(name) => name}
                disabled={isApplying}
              />
            </FormField>
          </When>

          <FormField
            label="Tags"
            caption="Afficher les tâches qui ont au moins un de ces tags."
          >
            <div className={styles.tagsRow}>
              {selectedTags.map((tag) => (
                <TagChip
                  key={tag.id}
                  tag={tag}
                  disabled={isApplying}
                  onRemove={handleRemoveTag}
                />
              ))}
              <TagsSelector
                projectId={projectId}
                excludeIds={selectedTags.map((tag) => tag.id)}
                onSelect={handleSelectTag}
                allowCreate={false}
                disabled={isApplying}
              />
            </div>
          </FormField>
        </Box>
      </Modal>
    );
  },
);
