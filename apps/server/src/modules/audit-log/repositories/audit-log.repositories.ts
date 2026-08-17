import prisma from "../../../config/prisma";

const actorSelect = { id: true, email: true };

export class AuditLogRepository {
  async findByWorkspaceId(workspaceId: string, options: { page: number; limit: number }) {
    const { page, limit } = options;
    return prisma.auditLog.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: actorSelect } },
    });
  }

  async countByWorkspaceId(workspaceId: string) {
    return prisma.auditLog.count({ where: { workspaceId } });
  }
}
