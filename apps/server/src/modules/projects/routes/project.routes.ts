import { Router } from "express";
import { ProjectController } from "../controllers/project.controllers";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { requireWorkspaceMember } from "../../../middleware/workspace.middleware";
import { validate } from "../../../middleware/validation.middleware";
import { createProjectSchema } from "../validators/project.validators";
import { asyncHandler } from "../../../utils/async-handler";

const router = Router();
const projectController = new ProjectController();

router.post("/", authMiddleware, requireWorkspaceMember, validate(createProjectSchema), asyncHandler(projectController.createProject.bind(projectController)));
router.get("/workspace/:workspaceId", authMiddleware, requireWorkspaceMember, asyncHandler(projectController.getProjects.bind(projectController)));
router.patch("/:projectId", authMiddleware, requireWorkspaceMember, asyncHandler(projectController.updateProject.bind(projectController)));
router.delete("/:projectId", authMiddleware, requireWorkspaceMember, asyncHandler(projectController.deleteProject.bind(projectController)));

export default router;