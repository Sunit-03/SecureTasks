import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controllers";
import {
  addMemberSchema,
  createWorkspaceSchema,
} from "../validators/workspace.validators";
import { asyncHandler } from "../../../utils/async-handler";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validation.middleware";
import { requireWorkspaceMember } from "../../../middleware/workspace.middleware";

const router = Router();
const workspaceController = new WorkspaceController();

router.post(
  "/",
  authMiddleware,
  validate(createWorkspaceSchema),
  asyncHandler(workspaceController.createWorkspace.bind(workspaceController)),
);

router.get(
  "/",
  authMiddleware,
  asyncHandler(workspaceController.getUserWorkspaces.bind(workspaceController)),
);

router.post(
  "/:workspaceId/members",
  authMiddleware,
  requireWorkspaceMember,
  validate(addMemberSchema),
  asyncHandler(workspaceController.addMember.bind(workspaceController)),
);

router.get(
  "/:workspaceId/members",
  authMiddleware,
  requireWorkspaceMember,
  asyncHandler(workspaceController.getMembers.bind(workspaceController)),
);

export default router;
