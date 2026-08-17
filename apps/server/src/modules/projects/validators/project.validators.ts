import z from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters long")
    .max(100),
  description: z.string().max(500).optional(),
  workspaceId: z.string().uuid("Invalid workspace ID format"),
});

export const updateProjectSchema = z.object({
    name: z
    .string()
    .min(3, "Project name must be at least 3 characters long")
    .max(100),
  description: z.string().max(500).optional(),
});