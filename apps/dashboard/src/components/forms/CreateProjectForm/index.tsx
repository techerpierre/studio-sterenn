'use client';

import { PlusIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Project } from '@sterenn/api-contracts';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { createProject } from '@/actions/project.actions';
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
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { sluggify } from '@/lib/utils/string';
import {
  createProjectFormSchema,
  CreateProjectFormSchema,
} from '@/validation/project.schemas';

const FORM_ID = 'create-project-form';

export type CreateProjectFormProps = {
  className?: string;
  onCreated?: (project: Project) => void;
};

export const CreateProjectForm = createModalComponent(
  function CreateProjectForm({
    className,
    onCreated,
  }: CreateProjectFormProps) {
    const { close } = useModal();
    const { toast } = useToast();
    const { currentWorkspace } = useWorkspace();
    const workspaceId = currentWorkspace?.id;

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<CreateProjectFormSchema>({
      resolver: zodResolver(createProjectFormSchema),
      defaultValues: {
        name: '',
        workspaceId: workspaceId ?? '',
      },
    });

    useEffect(() => {
      setValue('workspaceId', workspaceId ?? '');
    }, [workspaceId, setValue]);

    const onSubmit = async (data: CreateProjectFormSchema) => {
      if (!workspaceId) {
        toast({
          title: 'Création échouée',
          description: 'Aucun workspace sélectionné.',
          variant: 'danger',
        });
        return;
      }

      try {
        const project = await createProject({
          name: data.name,
          slug: sluggify(data.name),
          workspaceId,
        });
        onCreated?.(project);
        toast({
          title: 'Projet créé',
          description: `${project.name} a bien été créé.`,
          variant: 'success',
        });
        reset({
          name: '',
          workspaceId,
        });
        close();
      } catch (error) {
        console.error(error);
        toast({
          title: 'Création échouée',
          description: 'Impossible de créer le projet.',
          variant: 'danger',
        });
      }
    };

    return (
      <Modal
        className={className}
        title="Nouveau projet"
        size="sm"
        fill={false}
        trigger={
          <Button
            type="button"
            size="sm"
            icon
            variant="ghost"
            disabled={!workspaceId}
            aria-label="Nouveau projet"
          >
            <PlusIcon size={16} aria-hidden />
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
          <input type="hidden" {...register('workspaceId')} />
          <FormField label="Nom" error={errors.name?.message}>
            <TextInput
              type="text"
              placeholder="Mon projet"
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
