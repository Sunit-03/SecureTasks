import z from "zod";

const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

// Description is now stored as rich-text HTML from the client editor, hence the much
// larger cap than a plain-text field would need.
export const createTaskSchema = z.object({
    title: z.string().min(3, "Title is too short").max(100, "Title is too long"),
    description: z.string().max(10000, "Description is too long").optional(),
    projectId: z.string().uuid(),
    priority: taskPriorityEnum.optional(),
})

export const updateTaskSchema = z.object({
    title: z.string().min(3, "Title is too short").max(100, "Title is too long").optional(),
    description: z.string().max(10000, "Description is too long").optional(),
    statusId: z.string().uuid().optional(),
    priority: taskPriorityEnum.optional(),
    assigneeId: z.string().uuid().nullable().optional(),
    parentTaskId: z.string().uuid().nullable().optional(),
    mentionedUserIds: z.array(z.string().uuid()).max(50).optional(),
})
