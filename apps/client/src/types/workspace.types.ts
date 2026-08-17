export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type InvitableRole = "ADMIN" | "MEMBER" | "VIEWER";

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  user: { id: string; email: string };
  createdAt: string;
}

export interface CreateWorkspaceInput {
  name: string;
}

export interface AddMemberInput {
  email: string;
  role: InvitableRole;
}

export interface UpdateMemberRoleInput {
  role: InvitableRole;
}
