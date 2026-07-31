"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FocusEvent, useEffect } from "react";
import { useForm } from "react-hook-form";

import { updateProject } from "@/actions/project.actions";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { useProject } from "@/contexts/ProjectContext";
import { useProjectList } from "@/contexts/ProjectListContext";
import { sluggify } from "@/lib/utils/string";
import {
  updateProjectFormSchema,
  type UpdateProjectFormSchema,
} from "@/validation/project.schemas";

import styles from "./styles.module.css";

export function EditProjectForm() {
  const { project, setProject } = useProject();
  const { patchProject } = useProjectList();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProjectFormSchema>({
    resolver: zodResolver(updateProjectFormSchema),
    defaultValues: {
      name: project.name,
      slug: project.slug,
    },
  });

  useEffect(() => {
    reset({
      name: project.name,
      slug: project.slug,
    });
  }, [project.id, project.name, project.slug, reset]);

  const onSlugBlur = (event: FocusEvent<HTMLInputElement>) => {
    const next = sluggify(event.target.value);
    if (next && next !== event.target.value) {
      setValue("slug", next, { shouldDirty: true, shouldValidate: true });
    }
  };

  const onSubmit = async (data: UpdateProjectFormSchema) => {
    const slug = sluggify(data.slug);

    try {
      const updated = await updateProject(project.id, {
        name: data.name.trim(),
        slug,
      });

      if (!updated) {
        throw new Error("Project not found");
      }

      setProject(updated);
      patchProject(updated);
      reset({
        name: updated.name,
        slug: updated.slug,
      });
      toast({
        title: "Projet mis à jour",
        description: `« ${updated.name} » a bien été enregistré.`,
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Mise à jour échouée",
        description: "Impossible de mettre à jour le projet.",
        variant: "danger",
      });
    }
  };

  return (
    <Box
      as="form"
      direction="column"
      onSubmit={handleSubmit(onSubmit)}
      gap={32}
      className={styles.form}
    >
      <Box direction="column" gap={16}>
        <FormField
          label="Nom"
          caption="Le nom visible dans le tableau de bord et la navigation."
          error={errors.name?.message}
        >
          <TextInput
            type="text"
            placeholder="Mon projet"
            autoComplete="off"
            disabled={isSubmitting}
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Identifiant"
          caption="Utilisé comme référence interne. Lettres minuscules, chiffres et tirets uniquement."
          error={errors.slug?.message}
        >
          <TextInput
            type="text"
            placeholder="mon-projet"
            autoComplete="off"
            disabled={isSubmitting}
            {...register("slug", { onBlur: onSlugBlur })}
          />
        </FormField>
      </Box>

      <Button
        type="submit"
        variant="default"
        size="sm"
        loading={isSubmitting}
        disabled={!isDirty || isSubmitting}
        className={styles.submit}
      >
        Enregistrer
      </Button>
    </Box>
  );
}
