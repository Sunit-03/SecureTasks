import prisma from "../../../config/prisma";

const actorSelect = { id: true, email: true };

// Deliberately separate from every other repository in the codebase:
// these queries skip workspace-membership scoping on purpose (platform
// admin needs cross-tenant visibility). Keeping that bypass isolated here
// — rather than adding a flag to the member-facing repositories — keeps
// the tenant-isolation guarantee intact everywhere else.
export class AdminRepository {
  async findAllUsers(options: { page: number; limit: number }) {
    const { page, limit } = options;
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { workspaces: true, workspaceMembers: true } },
      },
    });
  }

  async countUsers() {
    return prisma.user.count();
  }

  async findAllWorkspaces(options: { page: number; limit: number }) {
    const { page, limit } = options;
    return prisma.workspace.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        owner: { select: actorSelect },
        _count: { select: { members: true, projects: true } },
      },
    });
  }

  async countWorkspaces() {
    return prisma.workspace.count();
  }

  async findGlobalAuditLog(options: { page: number; limit: number }) {
    const { page, limit } = options;
    return prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: actorSelect },
        workspace: { select: { id: true, name: true } },
      },
    });
  }

  async countAuditLog() {
    return prisma.auditLog.count();
  }
}
