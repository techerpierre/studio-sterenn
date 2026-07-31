import { z } from 'zod';

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hex invalide (ex: #7c3aed)');

export const createTaskStateFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(250, 'Le nom ne peut pas dépasser 250 caractères'),
  color: hexColor,
});

export const createTaskStateSchema = createTaskStateFormSchema.extend({
  beforeId: z.string().optional(),
  afterId: z.string().optional(),
});

export const updateTaskStateFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(250, 'Le nom ne peut pas dépasser 250 caractères'),
  color: hexColor,
});

export const updateTaskStateSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(250, 'Le nom ne peut pas dépasser 250 caractères')
    .optional(),
  color: hexColor.optional(),
  order: z
    .object({
      beforeId: z.string().optional(),
      afterId: z.string().optional(),
    })
    .optional(),
});

export type CreateTaskStateFormSchema = z.infer<
  typeof createTaskStateFormSchema
>;
export type CreateTaskStateSchema = z.infer<typeof createTaskStateSchema>;
export type UpdateTaskStateFormSchema = z.infer<
  typeof updateTaskStateFormSchema
>;
export type UpdateTaskStateSchema = z.infer<typeof updateTaskStateSchema>;
