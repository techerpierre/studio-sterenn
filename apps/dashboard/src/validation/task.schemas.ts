import { z } from 'zod';

const taskContentSchema = z
  .string()
  .max(1024, 'La description ne peut pas dépasser 1024 caractères');

const dueDateSchema = z.string().optional();
const ownerIdSchema = z.string().optional();

export const createTaskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(250, 'Le titre ne peut pas dépasser 250 caractères'),
  stateId: z.string().min(1, 'La colonne est requise'),
  content: taskContentSchema.optional(),
  dueDate: dueDateSchema,
  ownerId: ownerIdSchema,
});

export const createTaskSchema = createTaskFormSchema.extend({
  beforeId: z.string().optional(),
  afterId: z.string().optional(),
});

export const updateTaskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(250, 'Le titre ne peut pas dépasser 250 caractères'),
  content: taskContentSchema.optional(),
  dueDate: dueDateSchema,
  ownerId: ownerIdSchema,
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(250, 'Le titre ne peut pas dépasser 250 caractères')
    .optional(),
  content: taskContentSchema.optional(),
  dueDate: z.string().nullable().optional(),
  ownerId: z.string().optional(),
  stateId: z.string().nullable().optional(),
  order: z
    .object({
      beforeId: z.string().optional(),
      afterId: z.string().optional(),
    })
    .optional(),
});

/** Shared RHF field values for create + edit task modal. */
export type TaskFormValues = {
  title: string;
  stateId?: string;
  content?: string;
  dueDate?: string;
  ownerId?: string;
};

export type CreateTaskFormSchema = z.infer<typeof createTaskFormSchema>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormSchema = z.infer<typeof updateTaskFormSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
