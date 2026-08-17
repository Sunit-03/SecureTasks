import { Router } from "express";
import { NotificationController } from "../controllers/notification.controllers";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { asyncHandler } from "../../../utils/async-handler";

const router = Router();
const notificationController = new NotificationController();

router.get(
  "/",
  authMiddleware,
  asyncHandler(notificationController.getNotifications.bind(notificationController)),
);
router.patch(
  "/read-all",
  authMiddleware,
  asyncHandler(notificationController.markAllRead.bind(notificationController)),
);
router.patch(
  "/:id/read",
  authMiddleware,
  asyncHandler(notificationController.markRead.bind(notificationController)),
);

export default router;
