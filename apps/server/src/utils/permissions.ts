import { WorkspaceRole } from "@prisma/client";

// Strict superset: OWNER > ADMIN > MEMBER > VIEWER. Every ability a lower
// role has, every higher role also has.
const ROLE_RANK: Record<WorkspaceRole, number> = {
  VIEWER: 0,
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
};

export function hasRole(role: WorkspaceRole, min: WorkspaceRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}
