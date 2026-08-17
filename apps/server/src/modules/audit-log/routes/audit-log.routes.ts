import { Router } from "express";
import { AuditLogController } from "../controllers/audit-log.controllers";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { asyncHandler } from "../../../utils/async-handler";

// Mounted at /api/v1/workspaces/:workspaceId/audit-log (mergeParams so
// :workspaceId is visible here)
const router = Router({ mergeParams: true });
const auditLogController = new AuditLogController();

router.get(
  "/",
  authMiddleware,
  asyncHandler(auditLogController.getAuditLog.bind(auditLogController)),
);

export default router;
