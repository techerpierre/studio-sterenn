'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TaskState } from '@sterenn/api-contracts';
import { PlusIcon } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  createTaskState,
  updateTaskState,
} from '@/actions/task-state.actions';
import { Choose } from '@/components/logics';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { ColorInput } from '@/components/ui/ColorInput';
import { FormField } from '@/components/ui/FormField';
import {
  createModalComponent,
  Modal,
  useModal,
} from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/TextInput';
import { useBoard } from '@/contexts/BoardContext';
import { useActionFeedback } from '@/hooks/useActionFeedback';
import {
  createTaskStateFormSchema,
  CreateTaskStateFormSchema,
  updateTaskStateFormSchema,
  UpdateTaskStateFormSchema,
} from '@/validation/task-state.schemas';

const FORM_ID = 'task-state-form';
const DEFAULT_COLOR = '#7c3aed';

export type TaskStateFormProps = {
  projectId: string;
  state?: Pick<TaskState, 'id' | 'name' | 'color'>;
  beforeId?: string;
  afterId?: string;
  trigger?: ReactNode;
  onSaved?: (state: TaskState) => void;
};

export const TaskStateForm = createModalComponent(function TaskStateForm({
  projectId,
  state,
  beforeId,
  afterId,
  trigger,
  onSaved,
}: TaskStateFormProps) {
  const { close } = useModal();
  const { run } = useActionFeedback();
  const { insertState, upsertState } = useBoard();
  const isEdit = Boolean(state);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskStateFormSchema | UpdateTaskStateFormSchema>({
    resolver: zodResolver(
      isEdit ? updateTaskStateFormSchema : createTaskStateFormSchema,
    ),
    defaultValues: {
      name: state?.name ?? '',
      color: state?.color ?? DEFAULT_COLOR,
    },
  });

  useEffect(() => {
    reset({
      name: state?.name ?? '',
      color: state?.color ?? DEFAULT_COLOR,
    });
  }, [state, reset]);

  const onSubmit = async (
    data: CreateTaskStateFormSchema | UpdateTaskStateFormSchema,
  ) => {
    if (isEdit && state) {
      const updated = await run(
        async () => {
          const result = await updateTaskState(state.id, {
            name: data.name,
            color: data.color,
          });
          if (!result) {
            throw new Error('State not found');
          }
          return result;
        },
        {
          successTitle: 'Colonne mise à jour',
          successDescription: `"${data.name}" a bien été enregistrée.`,
          errorTitle: 'Mise à jour échouée',
          errorDescription: 'Impossible de mettre à jour la colonne.',
        },
      );
      if (!updated) return;
      upsertState(updated);
      onSaved?.(updated);
      close();
      return;
    }

    const created = await run(
      () =>
        createTaskState(projectId, {
          name: data.name,
          color: data.color,
          ...(beforeId ? { beforeId } : {}),
          ...(afterId ? { afterId } : {}),
        }),
      {
        successTitle: 'Colonne créée',
        successDescription: `"${data.name}" a bien été créée.`,
        errorTitle: 'Création échouée',
        errorDescription: 'Impossible de créer la colonne.',
      },
    );
    if (!created) return;
    insertState(created);
    onSaved?.(created);
    reset({ name: '', color: DEFAULT_COLOR });
    close();
  };

  return (
    <Modal
      title={
        <Choose
          when={isEdit}
          then="Modifier la colonne"
          otherwise="Nouvelle colonne"
        />
      }
      size="sm"
      fill={false}
      trigger={
        trigger ?? (
          <Button type="button" size="sm" variant="outline">
            <PlusIcon size={16} aria-hidden />
            Colonne
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
        <FormField label="Nom" error={errors.name?.message}>
          <TextInput
            type="text"
            placeholder="À faire"
            autoComplete="off"
            autoFocus
            disabled={isSubmitting}
            {...register('name')}
          />
        </FormField>
        <FormField label="Couleur" error={errors.color?.message}>
          <ColorInput
            disabled={isSubmitting}
            defaultValue={state?.color ?? DEFAULT_COLOR}
            {...register('color')}
          />
        </FormField>
      </Box>
    </Modal>
  );
});
