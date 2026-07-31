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
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
