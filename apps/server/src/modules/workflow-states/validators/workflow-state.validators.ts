import z from "zod";

const categoryEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createWorkflowStateSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  color: z.string().max(20).optional(),
  category: categoryEnum,
  isDefault: z.boolean().optional(),
});

export const updateWorkflowStateSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long").optional(),
  color: z.string().max(20).optional(),
  category: categoryEnum.optional(),
  isDefault: z.boolean().optional(),
});

export const reorderWorkflowStatesSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});
