'use client';

import { PlusIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createWorkspace } from '@/actions/workspace.actions';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import {
  createModalComponent,
  Modal,
  useModal,
} from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/TextInput';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useActionFeedback } from '@/hooks/useActionFeedback';
import {
  createWorkspaceSchema,
  CreateWorkspaceSchema,
} from '@/validation/workspace.schemas';

import styles from './styles.module.css';

const FORM_ID = 'create-workspace-form';

export type CreateWorkspaceFormProps = {
  className?: string;
};

export const CreateWorkspaceForm = createModalComponent(
  function CreateWorkspaceForm({ className }: CreateWorkspaceFormProps) {
    const { close } = useModal();
    const { run } = useActionFeedback();
    const { addWorkspace } = useWorkspace();

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<CreateWorkspaceSchema>({
      resolver: zodResolver(createWorkspaceSchema),
    });

    const onSubmit = async (data: CreateWorkspaceSchema) => {
      const workspace = await run(() => createWorkspace(data), {
        successTitle: 'Workspace créé',
        successDescription: `${data.name} a bien été créé.`,
        errorTitle: 'Création échouée',
        errorDescription: 'Impossible de créer le workspace.',
      });
      if (!workspace) return;
      addWorkspace(workspace);
      close();
    };

    return (
      <Modal
        className={className}
        title="Ajouter un workspace"
        size="sm"
        fill={false}
        trigger={
          <Button size="sm" variant="secondary" className={styles.createWorkspaceButton}>
            <PlusIcon size={16} />
            <span>Nouveau workspace</span>
          </Button>
        }
        footer={
          <>
            <Button type="button" variant="outline" onClick={close}>
              Annuler
            </Button>
            <Button type="submit" form={FORM_ID} loading={isSubmitting}>
              Créer
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
              placeholder="Mon workspace"
              autoComplete="off"
              autoFocus
              disabled={isSubmitting}
              {...register('name')}
            />
          </FormField>
        </Box>
      </Modal>
    );
  }
);
