import { z } from 'zod';

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hex invalide (ex: #2563eb)');

export const createTagFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  color: hexColor,
});

export const createTagSchema = createTagFormSchema.extend({
  projectId: z.string().min(1),
});

export const updateTagFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  color: hexColor,
});

export const updateTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .optional(),
  color: hexColor.optional(),
});

export type CreateTagFormSchema = z.infer<typeof createTagFormSchema>;
export type CreateTagSchema = z.infer<typeof createTagSchema>;
export type UpdateTagFormSchema = z.infer<typeof updateTagFormSchema>;
export type UpdateTagSchema = z.infer<typeof updateTagSchema>;
