import { Router } from "express";
import { AdminController } from "../controllers/admin.controllers";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { platformAdminMiddleware } from "../../../middleware/platform-admin.middleware";
import { asyncHandler } from "../../../utils/async-handler";

// Every route here is gated on the global platform Role plus an
// independent email domain/exception check (see platformAdminMiddleware),
// not any WorkspaceRole — a platform admin has cross-tenant visibility
// independent of workspace membership.
const router = Router();
const adminController = new AdminController();

router.get(
  "/users",
  authMiddleware,
  platformAdminMiddleware,
  asyncHandler(adminController.getUsers.bind(adminController)),
);

router.get(
  "/workspaces",
  authMiddleware,
  platformAdminMiddleware,
  asyncHandler(adminController.getWorkspaces.bind(adminController)),
);

router.get(
  "/audit-log",
  authMiddleware,
  platformAdminMiddleware,
  asyncHandler(adminController.getAuditLog.bind(adminController)),
);

export default router;
