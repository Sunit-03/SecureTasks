import { Router } from "express";
import { ProjectController } from "../controllers/project.controllers";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { requireWorkspaceMember } from "../../../middleware/workspace.middleware";
import { validate } from "../../../middleware/validation.middleware";
import { createProjectSchema } from "../validators/project.validators";
import { asyncHandler } from "../../../utils/async-handler";
import workflowStateRoutes from "../../workflow-states/routes/workflow-state.routes";

const router = Router();
const projectController = new ProjectController();

router.use("/:projectId/workflow-states", workflowStateRoutes);

router.post("/", authMiddleware, requireWorkspaceMember, validate(createProjectSchema), asyncHandler(projectController.createProject.bind(projectController)));
router.get("/workspace/:workspaceId", authMiddleware, requireWorkspaceMember, asyncHandler(projectController.getProjects.bind(projectController)));
// No requireWorkspaceMember here: it can only resolve a workspace from a
// client-supplied body field, not the project's actual workspace. The
// service looks up the project's real workspace and checks role there.
router.patch("/:projectId", authMiddleware, asyncHandler(projectController.updateProject.bind(projectController)));
router.delete("/:projectId", authMiddleware, asyncHandler(projectController.deleteProject.bind(projectController)));

export default router;