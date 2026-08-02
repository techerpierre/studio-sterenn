"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FocusEvent, useEffect } from "react";
import { useForm } from "react-hook-form";

import { updateProject } from "@/actions/project.actions";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { useProject } from "@/contexts/ProjectContext";
import { useProjectList } from "@/contexts/ProjectListContext";
import { useActionFeedback } from "@/hooks/useActionFeedback";
import { sluggify } from "@/lib/utils/string";
import {
  updateProjectFormSchema,
  type UpdateProjectFormSchema,
} from "@/validation/project.schemas";

import styles from "./styles.module.css";

export function EditProjectForm() {
  const { project, setProject } = useProject();
  const { patchProject } = useProjectList();
  const { run } = useActionFeedback();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectFormSchema>({
    resolver: zodResolver(updateProjectFormSchema),
    defaultValues: {
      name: project.name,
      slug: project.slug,
    },
  });

  const name = watch("name");
  const slug = watch("slug");
  const isDirty = name !== project.name || slug !== project.slug;

  // Sync only when switching project — reset on name/slug would clear dirty while typing.
  useEffect(() => {
    reset({
      name: project.name,
      slug: project.slug,
    });
  }, [project.id, reset]);

  const onSlugBlur = (event: FocusEvent<HTMLInputElement>) => {
    const next = sluggify(event.target.value);
    if (next && next !== event.target.value) {
      setValue("slug", next, { shouldDirty: true, shouldValidate: true });
    }
  };

  const onSubmit = async (data: UpdateProjectFormSchema) => {
    const nextSlug = sluggify(data.slug);

    const updated = await run(
      async () => {
        const result = await updateProject(project.id, {
          name: data.name.trim(),
          slug: nextSlug,
        });
        if (!result) {
          throw new Error("Project not found");
        }
        return result;
      },
      {
        successTitle: "Projet mis à jour",
        successDescription: `« ${data.name.trim()} » a bien été enregistré.`,
        errorTitle: "Mise à jour échouée",
        errorDescription: "Impossible de mettre à jour le projet.",
      },
    );
    if (!updated) return;

    setProject(updated);
    patchProject(updated);
    reset({
      name: updated.name,
      slug: updated.slug,
    });
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
