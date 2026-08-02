"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, Task } from "@sterenn/api-contracts";
import { ArchiveIcon, PlusIcon, TrashIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  deleteTask,
  markTaskAsArchived,
  updateTask,
} from "@/actions/task.actions";
import { ValidateActionDialog } from "@/components/dialogs/ValidateActionDialog";
import { Choose, When } from "@/components/logics";
import { TagField } from "@/components/tags/TagField";
import { MembersSelector } from "@/components/membership/MembersSelector";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { DateInput } from "@/components/ui/DateInput";
import { FormField } from "@/components/ui/FormField";
import { createModalComponent, Modal, useModal } from "@/components/ui/Modal";
import { Separator } from "@/components/ui/Separator";
import { TextInput } from "@/components/ui/TextInput";
import { useBoard } from "@/contexts/BoardContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useActionFeedback } from "@/hooks/useActionFeedback";
import { RichTextEditor } from "@/lib/tiptap";
import { createTaskWithTags } from "@/utils/createTaskWithTags";
import {
  buildCreateTaskPayload,
  buildUpdateTaskPayload,
} from "@/utils/taskPayload";
import {
  createTaskFormSchema,
  updateTaskFormSchema,
  type TaskFormValues,
} from "@/validation/task.schemas";

const FORM_ID = "task-form";

export type TaskFormProps = {
  projectId: string;
  stateId: string;
  task?: Task;
  beforeId?: string;
  afterId?: string;
  trigger?: ReactNode;
  className?: string;
  onSaved?: (task: Task) => void;
};

export const TaskForm = createModalComponent(function TaskForm({
  projectId,
  stateId,
  task,
  beforeId,
  afterId,
  trigger,
  className,
  onSaved,
}: TaskFormProps) {
  const { open, close } = useModal();
  const { run } = useActionFeedback();
  const { currentWorkspace } = useWorkspace();
  const { upsertTask, patchTask, removeTask } = useBoard();
  const isEdit = Boolean(task);
  const workspaceId = currentWorkspace?.id;
  const [editorKey, setEditorKey] = useState(0);
  const [tags, setTags] = useState<Tag[]>(task?.tags ?? []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(isEdit ? updateTaskFormSchema : createTaskFormSchema),
    defaultValues: isEdit
      ? {
          title: task?.title ?? "",
          content: task?.content ?? "",
          dueDate: task?.dueDate ?? "",
          ownerId: task?.ownerId,
        }
      : {
          title: "Nouvelle tâche",
          stateId,
          content: "",
          dueDate: "",
          ownerId: "",
        },
  });

  // Reset when the modal opens or the edited task identity changes — not on
  // tag-only board patches (those would remount the editor / show loading).
  useEffect(() => {
    if (!open) return;

    if (isEdit && task) {
      reset({
        title: task.title,
        content: task.content ?? "",
        dueDate: task.dueDate ?? "",
        ownerId: task.ownerId,
      });
      setTags(task.tags ?? []);
    } else {
      reset({
        title: "Nouvelle tâche",
        stateId,
        content: "",
        dueDate: "",
        ownerId: "",
      });
      setTags([]);
    }

    setEditorKey((key) => key + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from task only on open / id
  }, [open, isEdit, task?.id, stateId, reset]);

  const handleTagsChange = (next: Tag[]) => {
    setTags(next);
    if (task?.id) {
      patchTask(task.id, { tags: next });
    }
  };
  const onSubmit = async (data: TaskFormValues) => {
    if (isEdit && task) {
      const updated = await run(
        async () => {
          const result = await updateTask(
            task.id,
            buildUpdateTaskPayload(data),
          );
          if (!result) {
            throw new Error("Task not found");
          }
          return result;
        },
        {
          successTitle: "Tâche mise à jour",
          successDescription: `"${data.title}" a bien été enregistrée.`,
          errorTitle: "Mise à jour échouée",
          errorDescription: "Impossible de mettre à jour la tâche.",
        },
      );
      if (!updated) return;
      upsertTask(updated);
      onSaved?.(updated);
      close();
      return;
    }

    const created = await run(
      async () =>
        createTaskWithTags(
          projectId,
          buildCreateTaskPayload(
            { ...data, stateId: data.stateId ?? stateId },
            { stateId, beforeId, afterId },
          ),
          tags,
        ),
      {
        successTitle: "Tâche créée",
        successDescription: `"${data.title}" a bien été créée.`,
        errorTitle: "Création échouée",
        errorDescription: "Impossible de créer la tâche.",
      },
    );
    if (!created) return;

    upsertTask(created);
    onSaved?.(created);
    reset({
      title: "",
      stateId,
      content: "",
      dueDate: "",
      ownerId: "",
    });
    setTags([]);
    close();
  };

  const handleArchive = async () => {
    if (!task?.id) return;

    const archived = await run(
      async () => {
        const result = await markTaskAsArchived(task.id);
        if (!result) {
          throw new Error("Task not found");
        }
        return result;
      },
      {
        successTitle: "Tâche archivée",
        successDescription: `"${task.title}" a bien été archivée.`,
        errorTitle: "Archivage échoué",
        errorDescription: "Impossible d’archiver la tâche.",
      },
    );
    if (!archived) return;

    removeTask(archived.id);
    onSaved?.(archived);
    close();
  };

  const handleDelete = async () => {
    if (!task?.id) return;

    const title = task.title;
    const deleted = await run(
      async () => {
        await deleteTask(task.id);
        return true;
      },
      {
        successTitle: "Tâche supprimée",
        successDescription: `"${title}" a bien été supprimée.`,
        errorTitle: "Suppression échouée",
        errorDescription: "Impossible de supprimer la tâche.",
      },
    );
    if (!deleted) return;

    removeTask(task.id);
    close();
  };

  return (
    <Modal
      title={!isEdit && "Nouvelle tâche"}
      size="md"
      className={className}
      trigger={
        trigger ?? (
          <Button
            type="button"
            size="sm"
            icon
            variant="ghost"
            aria-label="Ajouter une tâche"
          >
            <PlusIcon size={16} aria-hidden />
          </Button>
        )
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={close}>
            Annuler
          </Button>
          <Button type="submit" form={FORM_ID} loading={isSubmitting}>
            <Choose when={isEdit} then="Enregistrer" otherwise="Créer" />
          </Button>
        </>
      }
    >
      <Box
        as="form"
        id={FORM_ID}
        direction="column"
        gap={16}
        onSubmit={handleSubmit(onSubmit)}
      >
        <When condition={!isEdit}>
          <input type="hidden" {...register("stateId")} />
        </When>
        <FormField error={errors.title?.message}>
          <TextInput
            type="text"
            variant="ghost"
            placeholder="Titre de la tâche"
            textType="heading3"
            autoComplete="off"
            multiline
            autoFocus
            disabled={isSubmitting}
            {...register("title")}
          />
        </FormField>
        <Separator variant="light" />
        <TagField
          projectId={projectId}
          taskId={task?.id}
          value={tags}
          onChange={handleTagsChange}
          disabled={isSubmitting}
        />
        <FormField error={errors.content?.message}>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                key={editorKey}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.content)}
              />
            )}
          />
        </FormField>
        <FormField label="Échéance" error={errors.dueDate?.message}>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DateInput
                name={field.name}
                ref={field.ref}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Ajouter une échéance"
                disabled={isSubmitting}
                calendarOptions={{
                  withTime: "hh:mm",
                }}
              />
            )}
          />
        </FormField>
        <When condition={Boolean(workspaceId)}>
          <FormField label="Assignation" error={errors.ownerId?.message}>
            <Controller
              name="ownerId"
              control={control}
              render={({ field }) => (
                <MembersSelector
                  workspaceId={workspaceId!}
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                  assignedLabel={(name) => `Tâche assignée à ${name}`}
                />
              )}
            />
          </FormField>
        </When>
        <When condition={Boolean(task?.id)}>
          <>
            <Separator variant="light" label="Actions" />
            <Box direction="column" gap={8}>
              <ValidateActionDialog
                critical
                criticalVariant="warning"
                trigger={
                  <Button type="button" variant="warning" size="sm">
                    <ArchiveIcon size={16} aria-hidden />
                    <span>Archiver la tâche</span>
                  </Button>
                }
                title="Êtes-vous sûr de vouloir archiver cette tâche ?"
                description="La tâche sera archivée et ne sera plus visible dans la liste des tâches."
                validateLabel="Archiver"
                cancelLabel="Annuler"
                onValidate={handleArchive}
              />
              <ValidateActionDialog
                critical
                criticalVariant="danger"
                trigger={
                  <Button type="button" variant="danger" size="sm">
                    <TrashIcon size={16} aria-hidden />
                    <span>Supprimer la tâche</span>
                  </Button>
                }
                title="Êtes-vous sûr de vouloir supprimer cette tâche ?"
                description="Cette action est irréversible. La tâche sera définitivement supprimée."
                validateLabel="Supprimer"
                cancelLabel="Annuler"
                onValidate={handleDelete}
              />
            </Box>
          </>
        </When>
      </Box>
    </Modal>
  );
});
