import z from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment can't be empty").max(2000, "Comment is too long"),
});
