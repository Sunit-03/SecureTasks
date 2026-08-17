import z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, "Name is too short").max(100, "Name is too long"),
});

export const addMemberSchema = z.object({
  email: z.email(),

  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});
