import { Router } from "express";
import { TaskController } from "../controllers/task.controllers";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validation.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validator/task.validator";
import { asyncHandler } from "../../../utils/async-handler";
import commentRoutes from "../../comments/routes/comment.routes";

const router = Router();
const taskController = new TaskController();

router.use("/:taskId/comments", commentRoutes);

router.post(
  "/",
  authMiddleware,
  validate(createTaskSchema),
  asyncHandler(taskController.createTask.bind(taskController)),
);
router.get(
  "/",
  authMiddleware,
  asyncHandler(taskController.getTasks.bind(taskController)),
);
router.get(
  "/:id",
  authMiddleware,
  asyncHandler(taskController.getTaskById.bind(taskController)),
);
router.patch(
  "/:id",
  authMiddleware,
  validate(updateTaskSchema),
  asyncHandler(taskController.updateTask.bind(taskController)),
);
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(taskController.deleteTask.bind(taskController)),
);

export default router;
