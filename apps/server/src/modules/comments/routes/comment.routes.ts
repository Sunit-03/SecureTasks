import { Router } from "express";
import { CommentController } from "../controllers/comment.controllers";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validation.middleware";
import { createCommentSchema } from "../validators/comment.validators";
import { asyncHandler } from "../../../utils/async-handler";

// Mounted at /api/v1/tasks/:taskId/comments (mergeParams so :taskId is visible here)
const router = Router({ mergeParams: true });
const commentController = new CommentController();

router.get(
  "/",
  authMiddleware,
  asyncHandler(commentController.getComments.bind(commentController)),
);
router.post(
  "/",
  authMiddleware,
  validate(createCommentSchema),
  asyncHandler(commentController.createComment.bind(commentController)),
);
router.delete(
  "/:commentId",
  authMiddleware,
  asyncHandler(commentController.deleteComment.bind(commentController)),
);

export default router;
