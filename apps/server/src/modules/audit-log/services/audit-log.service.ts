import prisma from "../../../config/prisma";
import { AppError } from "../../../utils/errors/app-error";
import { AuditLogRepository } from "../repositories/audit-log.repositories";

const auditLogRepository = new AuditLogRepository();

export class AuditLogService {
  async listForWorkspace(
    workspaceId: string,
    userId: string,
    query: { page?: string; limit?: string },
  ) {
    const membership = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId },
    });

    if (!membership || membership.role !== "OWNER") {
      throw new AppError("Only the workspace owner can view the audit log", 403);
    }

    const page = parseInt(query.page ?? "") || 1;
    const limit = Math.min(parseInt(query.limit ?? "") || 50, 100);

    const [entries, total] = await Promise.all([
      auditLogRepository.findByWorkspaceId(workspaceId, { page, limit }),
      auditLogRepository.countByWorkspaceId(workspaceId),
    ]);

    return { entries, total, page, limit };
  }
}
