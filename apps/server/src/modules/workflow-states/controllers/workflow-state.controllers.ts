import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.middleware";
import { WorkflowStateService } from "../services/workflow-state.service";

const workflowStateService = new WorkflowStateService();

export class WorkflowStateController {
  async getStates(req: AuthRequest, res: Response) {
    const states = await workflowStateService.listStates(
      req.params.projectId as string,
      req.user!.userId,
    );
    return res.json({ success: true, data: states });
  }

  async createState(req: AuthRequest, res: Response) {
    const state = await workflowStateService.createState(
      req.params.projectId as string,
      req.user!.userId,
      req.body,
    );
    return res.status(201).json({ success: true, data: state });
  }

  async updateState(req: AuthRequest, res: Response) {
    const state = await workflowStateService.updateState(
      req.params.projectId as string,
      req.user!.userId,
      req.params.stateId as string,
      req.body,
    );
    return res.json({ success: true, data: state });
  }

  async deleteState(req: AuthRequest, res: Response) {
    await workflowStateService.deleteState(
      req.params.projectId as string,
      req.user!.userId,
      req.params.stateId as string,
    );
    return res.json({ success: true, message: "Workflow status deleted successfully" });
  }

  async reorderStates(req: AuthRequest, res: Response) {
    const states = await workflowStateService.reorderStates(
      req.params.projectId as string,
      req.user!.userId,
      req.body.orderedIds,
    );
    return res.json({ success: true, data: states });
  }
}
