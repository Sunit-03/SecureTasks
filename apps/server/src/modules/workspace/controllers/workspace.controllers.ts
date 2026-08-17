import { Response } from "express";
import { WorkspaceService } from "../services/workspace.service";
import { AuthRequest } from "../../../middleware/auth.middleware";

const workspaceService = new WorkspaceService();

export class WorkspaceController {
  async createWorkspace(req: AuthRequest, res: Response) {
    const workspace = await workspaceService.createWorkspace(
      req.user!.userId,
      req.body,
    );
    res.status(201).json({ success: true, data: workspace });
  }

  async getUserWorkspaces(req: AuthRequest, res: Response) {
    const workspaces = await workspaceService.getUserWorkspaces(
      req.user!.userId,
    );
    res.json({ success: true, data: workspaces });
  }

  async addMember(req: AuthRequest, res: Response) {
    const member = await workspaceService.addMember(
      req.params.workspaceId as string,
      req.user!.userId,
      req.body.email,
      req.body.role,
    );

    return res.status(201).json({ success: true, data: member });
  }

  async getMembers(req: AuthRequest, res: Response) {
    const members = await workspaceService.getWorkspaceMembers(
      req.params.workspaceId as string,
    );

    return res.json({
      success: true,
      data: members,
    });
  }

  async updateMemberRole(req: AuthRequest, res: Response) {
    const member = await workspaceService.updateMemberRole(
      req.params.workspaceId as string,
      req.user!.userId,
      req.params.memberId as string,
      req.body.role,
    );

    return res.json({ success: true, data: member });
  }

  async deleteWorkspace(req: AuthRequest, res: Response) {
    await workspaceService.deleteWorkspace(req.params.workspaceId as string, req.user!.userId);

    return res.json({ success: true, message: "Workspace deleted successfully" });
  }
}
