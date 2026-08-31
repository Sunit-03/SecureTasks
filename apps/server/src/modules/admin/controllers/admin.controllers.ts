import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService();

export class AdminController {
  async getUsers(req: AuthRequest, res: Response) {
    const { users, total, page, limit } = await adminService.listUsers(
      req.query as { page?: string; limit?: string },
    );

    return res.json({ success: true, data: users, total, page, limit });
  }

  async getWorkspaces(req: AuthRequest, res: Response) {
    const { workspaces, total, page, limit } = await adminService.listWorkspaces(
      req.query as { page?: string; limit?: string },
    );

    return res.json({ success: true, data: workspaces, total, page, limit });
  }

  async getAuditLog(req: AuthRequest, res: Response) {
    const { entries, total, page, limit } = await adminService.listAuditLog(
      req.query as { page?: string; limit?: string },
    );

    return res.json({ success: true, data: entries, total, page, limit });
  }
}
