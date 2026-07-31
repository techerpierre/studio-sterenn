import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Le nom du workspace est requis"),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;