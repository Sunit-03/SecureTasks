import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

function getAdminExceptionEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAIL_EXCEPTIONS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

// Platform admin requires *two* independent signals, not one: the global
// Role is the primary, manually-granted control (checked first below), and
// this domain/exception check is a second, independent one — so a
// Role.ADMIN set on the wrong account by mistake or compromise still
// doesn't get in. The exception list exists only because
// the platform's own admin(s) don't necessarily hold an @ADMIN_DOMAIN
// mailbox; it is not a general invite mechanism and is only changeable via
// env config (redeploy), deliberately high-friction for something this
// sensitive.
export const platformAdminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Insufficient role" });
  }

  const email = req.user.email?.toLowerCase() ?? "";
  const adminDomain = (process.env.ADMIN_DOMAIN ?? "").toLowerCase();

  const matchesDomain = adminDomain.length > 0 && email.endsWith(`@${adminDomain}`);
  const isException = getAdminExceptionEmails().has(email);

  if (!matchesDomain && !isException) {
    return res.status(403).json({ message: "Forbidden: Admin access requires an authorized email" });
  }

  next();
};
