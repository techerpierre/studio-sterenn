'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tag } from '@sterenn/api-contracts';
import { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { createTag, updateTag } from '@/actions/tag.actions';
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
import { useActionFeedback } from '@/hooks/useActionFeedback';
import {
  createTagFormSchema,
  CreateTagFormSchema,
  updateTagFormSchema,
  UpdateTagFormSchema,
} from '@/validation/tag.schemas';

const FORM_ID = 'tag-form';
const DEFAULT_COLOR = '#2563eb';

export type TagFormProps = {
  projectId: string;
  tag?: Pick<Tag, 'id' | 'name' | 'color'>;
  /** Prefill name when creating (e.g. from search query). */
  initialName?: string;
  trigger?: ReactNode;
  onSaved?: (tag: Tag) => void;
};

export const TagForm = createModalComponent(function TagForm({
  projectId,
  tag,
  initialName,
  trigger,
  onSaved,
}: TagFormProps) {
  const { open, close } = useModal();
  const { run } = useActionFeedback();
  const isEdit = Boolean(tag);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTagFormSchema | UpdateTagFormSchema>({
    resolver: zodResolver(isEdit ? updateTagFormSchema : createTagFormSchema),
    defaultValues: {
      name: tag?.name ?? initialName ?? '',
      color: tag?.color ?? DEFAULT_COLOR,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: tag?.name ?? initialName ?? '',
      color: tag?.color ?? DEFAULT_COLOR,
    });
  }, [open, tag, initialName, reset]);

  const onSubmit = async (
    data: CreateTagFormSchema | UpdateTagFormSchema,
  ) => {
    if (isEdit && tag) {
      const updated = await run(
        async () => {
          const result = await updateTag(tag.id, {
            name: data.name,
            color: data.color,
          });
          if (!result) {
            throw new Error('Tag not found');
          }
          return result;
        },
        {
          successTitle: 'Tag mis à jour',
          successDescription: `"${data.name}" a bien été enregistré.`,
          errorTitle: 'Mise à jour échouée',
          errorDescription: 'Impossible de mettre à jour le tag.',
        },
      );
      if (!updated) return;
      onSaved?.(updated);
      close();
      return;
    }

    const created = await run(
      () =>
        createTag({
          name: data.name,
          color: data.color,
          projectId,
        }),
      {
        successTitle: 'Tag créé',
        successDescription: `"${data.name}" a bien été créé.`,
        errorTitle: 'Création échouée',
        errorDescription: 'Impossible de créer le tag.',
      },
    );
    if (!created) return;
    onSaved?.(created);
    reset({ name: '', color: DEFAULT_COLOR });
    close();
  };

  return (
    <Modal
      title={
        <Choose
          when={isEdit}
          then="Modifier le tag"
          otherwise="Nouveau tag"
        />
      }
      size="sm"
      fill={false}
      trigger={trigger}
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
            placeholder="Bug"
            autoComplete="off"
            autoFocus
            disabled={isSubmitting}
            {...register('name')}
          />
        </FormField>
        <FormField label="Couleur" error={errors.color?.message}>
          <ColorInput
            disabled={isSubmitting}
            defaultValue={tag?.color ?? DEFAULT_COLOR}
            {...register('color')}
          />
        </FormField>
      </Box>
    </Modal>
  );
});
