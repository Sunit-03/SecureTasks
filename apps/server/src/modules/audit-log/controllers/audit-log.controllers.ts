import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { AuditLogService } from "../services/audit-log.service";

const auditLogService = new AuditLogService();

export class AuditLogController {
  async getAuditLog(req: AuthRequest, res: Response) {
    const { entries, total, page, limit } = await auditLogService.listForWorkspace(
      req.params.workspaceId as string,
      req.user!.userId,
      req.query as { page?: string; limit?: string },
    );

    return res.json({ success: true, data: entries, total, page, limit });
  }
}
