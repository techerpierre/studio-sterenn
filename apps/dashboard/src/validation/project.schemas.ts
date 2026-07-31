import { z } from "zod";

export const createProjectFormSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom du projet doit contenir au moins 3 caractères")
    .max(50, "Le nom du projet ne peut pas dépasser 50 caractères"),
  workspaceId: z.string().min(1, "Le workspace est requis"),
});

export const createProjectSchema = createProjectFormSchema.extend({
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(50, "Le slug ne peut pas dépasser 50 caractères"),
});

export const updateProjectFormSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom du projet doit contenir au moins 3 caractères")
    .max(50, "Le nom du projet ne peut pas dépasser 50 caractères"),
  slug: z
    .string()
    .min(3, "L’identifiant doit contenir au moins 3 caractères")
    .max(50, "L’identifiant ne peut pas dépasser 50 caractères")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Utilisez uniquement des lettres minuscules, chiffres et tirets",
    ),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom du projet doit contenir au moins 3 caractères")
    .max(50, "Le nom du projet ne peut pas dépasser 50 caractères")
    .optional(),
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(50, "Le slug ne peut pas dépasser 50 caractères")
    .optional(),
});

export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>;
export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormSchema = z.infer<typeof updateProjectFormSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
