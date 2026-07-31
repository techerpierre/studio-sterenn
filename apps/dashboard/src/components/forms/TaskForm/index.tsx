"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@sterenn/api-contracts";
import { ArchiveIcon, PlusIcon, TrashIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  createTask,
  deleteTask,
  markTaskAsArchived,
  updateTask,
} from "@/actions/task.actions";
import { ValidateActionDialog } from "@/components/dialogs/ValidateActionDialog";
import { MembersSelector } from "@/components/membership/MembersSelector";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { DateInput } from "@/components/ui/DateInput";
import { FormField } from "@/components/ui/FormField";
import { createModalComponent, Modal, useModal } from "@/components/ui/Modal";
import { Separator } from "@/components/ui/Separator";
import { TextInput } from "@/components/ui/TextInput";
import { useToast } from "@/components/ui/Toast";
import { useBoard } from "@/contexts/BoardContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { RichTextEditor } from "@/lib/tiptap";
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
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const { upsertTask, removeTask } = useBoard();
  const isEdit = Boolean(task);
  const workspaceId = currentWorkspace?.id;
  const [editorKey, setEditorKey] = useState(0);

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

  // Reset whenever the modal opens so create/edit never reuse a previous draft
  // (the form instance stays mounted; modal content may also stay mounted during exit).
  useEffect(() => {
    if (!open) return;

    if (isEdit && task) {
      reset({
        title: task.title,
        content: task.content ?? "",
        dueDate: task.dueDate ?? "",
        ownerId: task.ownerId,
      });
    } else {
      reset({
        title: "Nouvelle tâche",
        stateId,
        content: "",
        dueDate: "",
        ownerId: "",
      });
    }

    setEditorKey((key) => key + 1);
  }, [open, isEdit, task, stateId, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    const content = data.content?.trim();
    const dueDate = data.dueDate?.trim() ? data.dueDate.trim() : null;
    const ownerId = data.ownerId?.trim() ? data.ownerId.trim() : undefined;

    try {
      if (isEdit && task) {
        const updated = await updateTask(task.id, {
          title: data.title,
          content,
          dueDate,
          ownerId,
        });
        if (!updated) {
          throw new Error("Task not found");
        }
        upsertTask(updated);
        onSaved?.(updated);
        toast({
          title: "Tâche mise à jour",
          description: `"${updated.title}" a bien été enregistrée.`,
          variant: "success",
        });
      } else {
        const created = await createTask(projectId, {
          title: data.title,
          stateId: data.stateId ?? stateId,
          content,
          dueDate: dueDate ?? undefined,
          ...(ownerId ? { ownerId } : {}),
          ...(beforeId ? { beforeId } : {}),
          ...(afterId ? { afterId } : {}),
        });
        upsertTask(created);
        onSaved?.(created);
        toast({
          title: "Tâche créée",
          description: `"${created.title}" a bien été créée.`,
          variant: "success",
        });
        reset({
          title: "",
          stateId,
          content: "",
          dueDate: "",
          ownerId: "",
        });
      }
      close();
    } catch (error) {
      console.error(error);
      toast({
        title: isEdit ? "Mise à jour échouée" : "Création échouée",
        description: isEdit
          ? "Impossible de mettre à jour la tâche."
          : "Impossible de créer la tâche.",
        variant: "danger",
      });
    }
  };

  const handleArchive = async () => {
    if (!task?.id) return;

    try {
      const archived = await markTaskAsArchived(task.id);
      if (!archived) {
        throw new Error("Task not found");
      }
      removeTask(archived.id);
      onSaved?.(archived);
      toast({
        title: "Tâche archivée",
        description: `"${archived.title}" a bien été archivée.`,
        variant: "success",
      });
      close();
    } catch (error) {
      console.error(error);
      toast({
        title: "Archivage échoué",
        description: "Impossible d’archiver la tâche.",
        variant: "danger",
      });
    }
  };

  const handleDelete = async () => {
    if (!task?.id) return;

    const title = task.title;
    try {
      await deleteTask(task.id);
      removeTask(task.id);
      toast({
        title: "Tâche supprimée",
        description: `"${title}" a bien été supprimée.`,
        variant: "success",
      });
      close();
    } catch (error) {
      console.error(error);
      toast({
        title: "Suppression échouée",
        description: "Impossible de supprimer la tâche.",
        variant: "danger",
      });
    }
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
            {isEdit ? "Enregistrer" : "Créer"}
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
        {!isEdit ? <input type="hidden" {...register("stateId")} /> : null}
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
        {workspaceId ? (
          <FormField label="Assignation" error={errors.ownerId?.message}>
            <Controller
              name="ownerId"
              control={control}
              render={({ field }) => (
                <MembersSelector
                  workspaceId={workspaceId}
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                  assignedLabel={(name) => `Tâche assignée à ${name}`}
                />
              )}
            />
          </FormField>
        ) : null}
        {task?.id ? (
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
        ) : null}
      </Box>
    </Modal>
  );
});
