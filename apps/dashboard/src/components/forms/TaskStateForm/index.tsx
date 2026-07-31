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
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import {
  createModalComponent,
  Modal,
  useModal,
} from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/Toast';
import { useBoard } from '@/contexts/BoardContext';
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
  const { toast } = useToast();
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
    try {
      if (isEdit && state) {
        const updated = await updateTaskState(state.id, {
          name: data.name,
          color: data.color,
        });
        if (!updated) {
          throw new Error('State not found');
        }
        upsertState(updated);
        onSaved?.(updated);
        toast({
          title: 'Colonne mise à jour',
          description: `"${updated.name}" a bien été enregistrée.`,
          variant: 'success',
        });
      } else {
        const created = await createTaskState(projectId, {
          name: data.name,
          color: data.color,
          ...(beforeId ? { beforeId } : {}),
          ...(afterId ? { afterId } : {}),
        });
        insertState(created);
        onSaved?.(created);
        toast({
          title: 'Colonne créée',
          description: `"${created.name}" a bien été créée.`,
          variant: 'success',
        });
        reset({ name: '', color: DEFAULT_COLOR });
      }
      close();
    } catch (error) {
      console.error(error);
      toast({
        title: isEdit ? 'Mise à jour échouée' : 'Création échouée',
        description: isEdit
          ? 'Impossible de mettre à jour la colonne.'
          : 'Impossible de créer la colonne.',
        variant: 'danger',
      });
    }
  };

  return (
    <Modal
      title={isEdit ? 'Modifier la colonne' : 'Nouvelle colonne'}
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
            {isEdit ? 'Enregistrer' : 'Créer'}
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
          <TextInput
            type="color"
            disabled={isSubmitting}
            {...register('color')}
          />
        </FormField>
      </Box>
    </Modal>
  );
});
