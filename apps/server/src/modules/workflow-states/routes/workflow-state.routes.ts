import { Router } from "express";
import { WorkflowStateController } from "../controllers/workflow-state.controllers";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validation.middleware";
import {
  createWorkflowStateSchema,
  reorderWorkflowStatesSchema,
  updateWorkflowStateSchema,
} from "../validators/workflow-state.validators";
import { asyncHandler } from "../../../utils/async-handler";

// Mounted at /api/v1/projects/:projectId/workflow-states (mergeParams so :projectId is visible here)
const router = Router({ mergeParams: true });
const workflowStateController = new WorkflowStateController();

router.get(
  "/",
  authMiddleware,
  asyncHandler(workflowStateController.getStates.bind(workflowStateController)),
);

router.post(
  "/",
  authMiddleware,
  validate(createWorkflowStateSchema),
  asyncHandler(workflowStateController.createState.bind(workflowStateController)),
);

router.put(
  "/reorder",
  authMiddleware,
  validate(reorderWorkflowStatesSchema),
  asyncHandler(workflowStateController.reorderStates.bind(workflowStateController)),
);

router.patch(
  "/:stateId",
  authMiddleware,
  validate(updateWorkflowStateSchema),
  asyncHandler(workflowStateController.updateState.bind(workflowStateController)),
);

router.delete(
  "/:stateId",
  authMiddleware,
  asyncHandler(workflowStateController.deleteState.bind(workflowStateController)),
);

export default router;
