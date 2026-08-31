export interface AdminUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: { workspaces: number; workspaceMembers: number };
}

export interface AdminWorkspace {
  id: string;
  name: string;
  ownerId: string;
  owner: { id: string; email: string };
  createdAt: string;
  updatedAt: string;
  _count: { members: number; projects: number };
}

export interface AdminAuditLogEntry {
  id: string;
  action: string;
  ipAddress: string | null;
  metadata: Record<string, unknown> | null;
  userId: string;
  user: { id: string; email: string };
  workspaceId: string | null;
  workspace: { id: string; name: string } | null;
  createdAt: string;
}

export interface AdminPaginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
