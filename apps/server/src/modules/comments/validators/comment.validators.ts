import z from "zod";

// Content is rich-text HTML from the client editor, hence the larger cap
// than a plain-text comment would need.
export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment can't be empty").max(5000, "Comment is too long"),
  parentCommentId: z.string().uuid().optional(),
  mentionedUserIds: z.array(z.string().uuid()).max(50).optional(),
});
